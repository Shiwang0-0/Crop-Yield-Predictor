import { useState } from "react"
import { InputString, SelectOption } from "../Components/Inputs";
import { server } from "../constants/configServer";
import type { formData, PredictionResponse, FormValues } from "../constants/interfaces/crop";
import { cropOptions, stateOptions, seasonOptions } from "../constants/cropDetails";
import axios from "axios";
import { getRandomData } from "../utils/getRandomData";
import toast from "react-hot-toast";
const Predict = () => {

    const numberRegex = /^\d*\.?\d*$/;
    
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

    const [showResultModal, setShowResultModal] = useState(false);
    const [predictedYield, setPredictedYield] = useState<number | null>(null);
    const [comparison, setComparison]= useState<{userAvg:number|null, globalAvg:number|null}>({userAvg:null, globalAvg:null});

    const [showPublishResultModal, setShowPublishResultModal]=useState<boolean | null>(null);
    const [showPublishSupportModal, setShowPublishSupportModal]=useState<boolean | null>(null);
    const [showSupportModal, setShowSupportModal]=useState<boolean | null>(null);
    const [supportType, setSupportType] = useState<string>("");
    const [supportDescription, setSupportDescription] = useState<string>("");

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
            console.log("new res:" ,res);
            if (!res)
                throw new Error("Server error response not ok");
            setPredictedYield(res.data.outputYield);
            setComparison({
                userAvg: res.data.userAvg ?? null,
                globalAvg: res.data.globalAvg ?? null,
            });
            if (res.data.userAvg  && res.data.outputYield < 5 * res.data.userAvg){
                console.log("hii")
                setShowSupportModal(true);
            }else{
                setShowResultModal(true);
            }
            console.log("predicted value", res.data.outputYield);

        } catch{
            toast.error("Something went wrong while submitting the form.");
        }
    }


    const handlePublish=()=>{
        if(!form){
            toast.error("Cannot Publish an Empty Form");
            return;
        }
        setShowPublishResultModal(true);
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
            setShowResultModal(false);
            setShowPublishResultModal(false);
        }catch{
            toast.error("Something went wrong while publishing the results.");
        }
    }

    const handleSupportSubmit = async () => {
        try {
            await axios.post(`${server}/user/support-request`, {
            ...formValues,
            predictedYield,
            supportType,
            supportDescription,
            }, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
            });
            toast.success("Support request submitted.");
            setShowPublishSupportModal(false);
        }catch{
            toast.error("Error submitting support request.");
        }
    };

return (
  <>
    <div className="min-h-screen w-full flex font-sans">
      <div className="w-[30%] bg-[#1E4023] text-white flex flex-col justify-center items-center px-6 py-10">
        <h2 className="text-4xl font-bold mb-6 text-center leading-tight">AI Crop Yield</h2>
        <p className="text-md text-gray-200 text-center">Predict agricultural yield with precision and ease. Powered by explainable AI, tailored for farmers and analysts.</p>
        <img src="/crop.png" alt="crop" className="w-32 mt-10 opacity-90" />
      </div>

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

    {showSupportModal &&  predictedYield !== null && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Low Yield Detected</h2>
        <p className="text-gray-700 mb-4">
            Your predicted yield is significantly lower than your previous performance.
            Would you like assistance or support?
        </p>
        {comparison.userAvg !== null && (
            <p className="text-2lg text-gray-700 mt-1">
            Compared to your average prediction for this combination:{" "}
            <span className="font-semibold text-red-800">
                {Math.abs(predictedYield - comparison.userAvg)?.toFixed(2)}%{" "}
                {predictedYield > comparison.userAvg ? "higher" : "lower"}
            </span>
            </p>
        )}

        {comparison.globalAvg !== null && (
            <p className="text-2lg text-gray-700">
            Compared to the global average:{" "}
            <span className="font-semibold text-red-800">
                {Math.abs(predictedYield - comparison.globalAvg)?.toFixed(2)}%{" "}
                {predictedYield > comparison.globalAvg ? "higher" : "lower"}
            </span>
            </p>
        )}
        <div className="flex justify-center gap-4 mt-6">
            <button onClick={() => {setShowPublishResultModal(true); setShowSupportModal(false)}} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-full" > No, Thanks
            </button>
            <button onClick={()=>{ setShowSupportModal(false); setShowPublishSupportModal(true) }} className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded-full">
            Yes, I Want Help
            </button>
        </div>
        </div>
    </div>
    )}

    {showPublishSupportModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto scrollbar-hide">
        <div className="bg-white p-6 rounded-xl shadow-lg w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h2 className="text-3xl font-semibold mb-4 text-yellow-600">Request Support</h2>

            <p className="text-gray-700 mb-4 text-lg">
            <span className="font-semibold">Predicted Yield:</span>{" "}
            {predictedYield?.toFixed(2)}%
            </p>

            <div className="bg-gray-100 p-4 rounded text-lg text-gray-800 space-y-2">
            {Object.entries(formValues).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-1">
                <span className="font-medium capitalize">{key.replace("_", " ")}:</span>
                <span>{value}</span>
                </div>
            ))}
            </div>

            <div className="mt-6 space-y-4">
            <label className="block text-md font-medium text-gray-700">What kind of support do you need?</label>
            <select
                className="w-full p-2 border rounded-md bg-white text-gray-800"
                onChange={(e) => setSupportType(e.target.value)} 
            defaultValue="">
                <option disabled value="">Select support type</option>
                <option value="financial">Financial Assistance</option>
                <option value="technical">Technical Help</option>
                <option value="advisory">Crop Advisory</option>
                <option value="other">Other</option>
            </select>

            <label className="block text-md font-medium text-gray-700 mt-4">
                Describe your situation (optional)
            </label>
            <textarea
                className="w-full p-3 border rounded-md bg-white text-gray-800" rows={4} placeholder="Explain why you need support..."
                onChange={(e) => setSupportDescription(e.target.value)} 
            />

            <p className="text-sm text-gray-600 mt-2">
                <span className="text-red-500 font-bold">*</span>{" "}
                Make sure the information is accurate. Support team may reach out to verify.
            </p>

            <div className="flex justify-end gap-4 mt-4">
                <button onClick={() => setShowPublishSupportModal(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-full">
                Cancel</button>
                <button
                onClick={handleSupportSubmit}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full">
                Submit Request</button>
            </div>
            </div>
        </div>
    </div>


    )}

    {showResultModal && predictedYield !== null && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-green-800">Prediction Complete</h2>

        <p className="text-gray-700 mb-2">
            <span className="font-semibold">Estimated Yield:</span>{" "}
            {predictedYield?.toFixed(2)}%
        </p>

        {comparison.userAvg !== null && (
            <p className="text-2lg text-gray-700 mt-1">
            Compared to your average prediction for this combination:{" "}
            <span className="font-semibold text-green-800">
                {Math.abs(predictedYield - comparison.userAvg)?.toFixed(2)}%{" "}
                {predictedYield > comparison.userAvg ? "higher" : "lower"}
            </span>
            </p>
        )}

        {comparison.globalAvg !== null && (
            <p className="text-2lg text-gray-700">
            Compared to the global average:{" "}
            <span className="font-semibold text-green-800">
                {Math.abs(predictedYield - comparison.globalAvg)?.toFixed(2)}%{" "}
                {predictedYield > comparison.globalAvg ? "higher" : "lower"}
            </span>
            </p>
        )}

        <div className="mt-6 flex justify-end gap-4">
            <button
            onClick={() => setShowResultModal(false)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-full" > Close </button> 
            <button onClick={handlePublish} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full" > Save and Publish 
            </button>
        </div>
        </div>
    </div>
    )}

    {showPublishResultModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-xl">
            <h2 className="text-2xl font-semibold mb-4 text-green-800">Confirm Publish</h2>

            <p className="text-gray-700 mb-2">
                <span className="font-semibold">Predicted Yield:</span>{" "}
                {predictedYield?.toFixed(2)}%
            </p>

            <div className="bg-gray-100 p-4 rounded text-2lg text-gray-800 space-y-2">
                {Object.entries(formValues).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-1">
                    <span className="font-medium capitalize">{key.replace("_", " ")}:</span>
                    <span>{value}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 space-y-4">
                <p className="text-2lg text-gray-600"> 
                    <span className="text-red-500 font-bold">*</span>{" "}
                    Make sure the provided information is correct, as it will be viewed by stakeholders and may be verified later.
                </p>
                <div className="flex justify-end gap-4">
                    <button onClick={() => setShowPublishResultModal(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-full" > 
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