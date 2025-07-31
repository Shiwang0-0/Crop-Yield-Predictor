import { useState } from "react"
import { InputString, SelectOption } from "../Components/Inputs";
import { server } from "../constants/configServer";
import type { formData, PredictionResponse, FormValues } from "../constants/interfaces/crop";
import axios from "axios";
import { getRandomData } from "../utils/getRandomData";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Predict = () => {

    

    const numberRegex = /^\d*\.?\d*$/;

    const cropOptions = ['Arecanut', 'Arhar/Tur', 'Bajra', 'Banana', 'Barley', 'Black pepper', 'Cardamom', 'Cashewnut', 'Castor seed', 'Coconut', 'Coriander', 'Cotton(lint)', 'Cowpea(Lobia)', 'Dry chillies', 'Garlic', 'Ginger', 'Gram', 'Groundnut', 'Guar seed', 'Horse-gram', 'Jowar', 'Jute', 'Khesari', 'Linseed', 'Maize', 'Masoor', 'Mesta', 'Moong(Green Gram)', 'Moth', 'Niger seed', 'Oilseeds total', 'Onion', 'Other  Rabi pulses', 'Other Cereals', 'Other Kharif pulses', 'Other Summer Pulses', 'Peas & beans (Pulses)', 'Potato', 'Ragi', 'Rapeseed &Mustard', 'Rice', 'Safflower', 'Sannhamp', 'Sesamum', 'Small millets', 'Soyabean', 'Sugarcane', 'Sunflower', 'Sweet potato', 'Tapioca', 'Tobacco', 'Turmeric', 'Urad', 'Wheat', 'other oilseeds'];
    const seasonOptions = ['Autumn', 'Kharif', 'Rabi', 'Summer', 'Whole Year', 'Winter'];
    const stateOptions = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
    
    const handleChange = (key: keyof formData, value: string) => {
            setForm((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                value,
            },
            }));
        };

    const handleNumeric = (key: keyof formData, value: string) => {
        if (value === "" || numberRegex.test(value)) {
            handleChange(key, value);
        }
    };

    const [showPopup, setShowPopup] = useState(false);
    const [predictedYield, setPredictedYield] = useState<number | null>(null);

    const [showModal, setShowModal]=useState<boolean | null>(null);

    const [formValues,setFormValues]=useState<FormValues>(
        {crop: "",crop_year: "",season: "",state: "",area: "",rainfall: "",fertilizer: "",pesticide: ""}
    );

    const [form, setForm] = useState<formData>({
        crop: { label: "Crop", name: "crop", value: "", placeholder: "Select a crop", required: true, options: cropOptions, 
            onChange: (e) => handleChange("crop", e.target.value),
        },
        crop_year: { label: "Crop Year", name: "crop_year", value: "", placeholder: "Enter crop year", required: true, 
            onChange: (e) => handleChange("crop_year", e.target.value),
        },
        season: { label: "Season", name: "season", value: "", placeholder: "Select a season", required: true, options: seasonOptions,       
            onChange: (e) => handleChange("season", e.target.value),
        },
        state: { label: "State", name: "state", value: "", placeholder: "Select a state", required: true, options: stateOptions, 
            onChange: (e) => handleChange("state", e.target.value),
        },
        area: { label: "Area", name: "area", value: "", placeholder: "Enter area", required: true, 
            onChange: (e) => handleNumeric("area", e.target.value),
        },
        rainfall: { label: "Rainfall", name: "rainfall", value: "", placeholder: "Enter rainfall", required: true, 
            onChange: (e) => handleNumeric("rainfall", e.target.value),
        },
        fertilizer: { label: "Fertilizer", name: "fertilizer", value: "", placeholder: "Enter fertilizer", required: true, 
            onChange: (e) => handleNumeric("fertilizer", e.target.value),
        },
        pesticide: { label: "Pesticide", name: "pesticide", value: "", placeholder: "Enter pesticide", required: true, 
            onChange: (e) => handleNumeric("pesticide", e.target.value),
        },
    });

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
            setShowPopup(false);
            }, 10000); // 10 seconds

            return () => clearTimeout(timer); // Clear if popup is dismissed earlier
        }
    }, [showPopup]);

    const setRandomData = async () => {
    const random = await getRandomData(); // plain object with strings

    setForm((prev) => ({
        ...prev,
        crop: { ...prev.crop, value: random.crop },
        crop_year: { ...prev.crop_year, value: random.crop_year },
        season: { ...prev.season, value: random.season },
        state: { ...prev.state, value: random.state },
        area: { ...prev.area, value: random.area },
        rainfall: { ...prev.rainfall, value: random.rainfall },
        fertilizer: { ...prev.fertilizer, value: random.fertilizer },
        pesticide: { ...prev.pesticide, value: random.pesticide },
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formValues: FormValues = {
            crop: form.crop.value,
            crop_year: form.crop_year.value,
            season: form.season.value,
            state: form.state.value,
            area: form.area.value,
            rainfall: form.rainfall.value,
            fertilizer: form.fertilizer.value,
            pesticide: form.pesticide.value,
        };
        setFormValues(formValues)
        try {
            const res = await axios.post<PredictionResponse>(
                `${server}/user/predict`,
                formValues,
                {
                    withCredentials: true,
                    headers: {
                    "Content-Type": "application/json"
                    }
                }
            );
            console.log(res);
            if (!res)
                throw new Error("Server error response not ok");
            setPredictedYield(res.data.yield);
            setShowPopup(true);
            console.log("predicted value", res.data.yield);

        } catch{
            toast.error("Something went wrong while submitting the form.");
        }
    }


    const handlePublish=()=>{
        if(!form){
            toast.error("Cannot Publish an Empty Form");
            return;
        }
        setShowModal(true);
    }

    const confirmPublish=async()=>{
        try{
            const res= await axios.post<{message:string}>(
               `${server}/user/publish`,
                {...formValues, predictedYield},
                {
                    withCredentials: true,
                    headers: {
                    "Content-Type": "application/json"
                    }
                }
            );
            if(!res)
                throw new Error("Error Publishing the results");
            toast.success(res.data.message);
        }catch{
            toast.error("Something went wrong while publishing the results.");
        }
    }
return (
  <>
    <div className="min-h-screen w-full flex font-sans">
      {/* Left Green Panel */}
      <div className="w-[30%] bg-[#1E4023] text-white flex flex-col justify-center items-center px-6 py-10">
        <h2 className="text-4xl font-bold mb-6 text-center leading-tight">AI Crop Yield</h2>
        <p className="text-md text-gray-200 text-center">Predict agricultural yield with precision and ease. Powered by explainable AI, tailored for farmers and analysts.</p>
        <img src="/crop.png" alt="crop" className="w-32 mt-10 opacity-90" />
      </div>

      {/* Right Form Section */}
      <div className="w-[70%] bg-gray-50 text-black px-10 py-16 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-semibold mb-8 text-center">Enter Crop Details</h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <SelectOption {...form.crop} />
              <InputString {...form.crop_year} />
              <SelectOption {...form.season} />
              <SelectOption {...form.state} />
              <InputString {...form.area} />
              <InputString {...form.rainfall} />
              <InputString {...form.fertilizer} />
              <InputString {...form.pesticide} />
            </div>

            <div className="flex flex-col items-center justify-center gap-4 mt-8">
              <button type="submit" className="w-52 h-12 bg-[#1E4023] hover:bg-green-700 transition-all duration-300 text-white rounded-full shadow-md text- font-semibold"> Predict </button>
              <button type="button" onClick={setRandomData} className="w-48 h-10 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition duration-300"> Get Random Data </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    {showPopup && predictedYield !== null && (
    <div className="fixed bottom-10 right-10 z-50 flex items-center w-[350px] shadow-xl rounded-xl bg-white/20 backdrop-blur-md border border-white/30 animate-fade-in-up overflow-hidden">
    <div className="w-2 bg-green-500 h-full"></div>
    
        <div className="p-5 w-full">
            <h3 className="text-xl font-semibold text-green-800">Prediction Complete</h3>
            <p className="mt-2 text-gray-800 dark:text-black-200">
                Estimated Yield: <span className="font-bold">{predictedYield.toFixed(2)}%</span>
            </p>

            <div className="mt-4 flex gap-3">
                <button onClick={() => setShowPopup(false)} className="flex-1 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full transition duration-300">Close</button>
                <button onClick={handlePublish} className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition duration-300">Save and Publish</button>
            </div>
        </div>

        <div className="w-2 bg-green-500 h-full"></div>
    </div>

    )}

    {showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-xl">
            <h2 className="text-2xl font-semibold mb-4 text-green-800">Confirm Publish</h2>

            <p className="text-gray-700 mb-2">
                <span className="font-semibold">Predicted Yield:</span>{" "}
                {predictedYield?.toFixed(2)}%
            </p>

            <div className="bg-gray-100 p-4 rounded text-sm text-gray-800 space-y-2">
                {Object.entries(formValues).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-1">
                    <span className="font-medium capitalize">{key.replace("_", " ")}:</span>
                    <span>{value}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 space-y-4">
                <p className="text-sm text-gray-600"> 
                    <span className="text-red-500 font-bold">*</span>{" "}
                    Make sure the provided information is correct, as it will be viewed by stakeholders and may be verified later.
                </p>
                <div className="flex justify-end gap-4">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-full" > 
                        Cancel 
                    </button> 
                    <button onClick={confirmPublish} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full" > 
                        Confirm &  Publish
                    </button>
                </div>
            </div>

        </div>
    </div>

    )}
  </>  
)} 

export default Predict;