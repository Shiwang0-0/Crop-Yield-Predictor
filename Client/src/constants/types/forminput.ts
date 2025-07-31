export interface inputPropsString {
  label: string,
  name: string,
  placeholder?: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean
}

export interface SelectPropsOptions {
  label:string,
  name:string,
  value:string,
  placeholder:string,
  onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void;
  options:string[],
  required?:boolean
}

/*
export interface inputPropsNumber{
  label: string,
  name: string,
  placeholder?: string,
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean
}
*/
