import type { inputPropsString, SelectPropsOptions } from "../constants/interfaces/forminput"



const InputString = (props: inputPropsString) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={props.name}
        className="flex items-center mb-2 text-sm font-medium text-gray-600"
      >
        {props.label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input type="text" id={props.name} name={props.name} pattern="\d*\.?\d*" required title="Please enter a valid number" value={props.value ?? ""} onChange={props.onChange} placeholder={props.placeholder} className="w-full h-11 px-5 py-2.5 text-base text-gray-900 border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
      />
    </div>
  )
}



const SelectOption=(props: SelectPropsOptions)=>{
  return(
    <div className="mb-6">
      <label
        htmlFor={props.name}
        className="flex items-center mb-2 text-sm font-medium text-gray-600"
        >
        {props.label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select id={props.name} name={props.name} value={props.value ?? ""} onChange={props.onChange} className="w-full h-11 px-4 py-2.5 text-base text-gray-900 border border-gray-300 rounded-full focus:outline-none">
        <option value="" disabled>
            {props.placeholder}
        </option>
          {(props.options ?? []).map((i,idx)=>(
            <option key={idx} value={i}>{i}</option>
          ))}
      </select>

      </div>
  )
}

export {InputString, SelectOption};
/*
const InputNumber = (props: inputPropsNumber) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={props.name}
        className="flex items-center mb-2 text-sm font-medium text-gray-600"
      >
        {props.label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input type="number" id={props.name} name={props.name} value={props.value} onChange={props.onChange} placeholder={props.placeholder} className="w-full h-11 px-5 py-2.5 text-base text-gray-900 border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
      />
    </div>
  )
}
*/