


export function airmail(id, type, weight,height,description){
	
}

//Generate PackageId 
const generateID = () => Math.random().toString(36).slice(2);
//Global Variables
export const randomID = generateID();

const formgetInputfields = document.getElementById("getInputfields");
const inputfieldtype = document.getElementById('selectPackageType');
const inputfieldweight = document.getElementById('floatWeight');
const inputfieldheight = document.getElementById('floatHeight');
const inputfielddescription = document.getElementById('description');


export function submit(){	
const type = inputfieldtype.value;
const weight = inputfieldweight.value;
const height = inputfieldheight.value;
const description = inputfielddescription.value;
}

formgetInputfields.addEventListener("change", submit);
