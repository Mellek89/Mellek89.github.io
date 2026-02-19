/**
 * this class describes the package that should be send or collect
 */

 
 class Package{
	 
	 constructor(packageID, type, weight,height,description){
	 this.packageID = packageID;
	 this.type = type;
	 this.weight = weight;
	 this.height = height;
	 this.description= description;
	 
	 }
	 
	 getPackageId(){
		 
		 return this.packageId;
	 }
	 
	 getType(){
		 return this.type;
	 }
	 
	 getWeight(){
		 return this.weight;
	 }
	 getHeight(){
		 return this.height;
	 }
	 getDescription(){
		 return this.description;
	 }
	 
	 /*setPackageId(packageId){
		 this.packageId= packageId
		 return packageId;
	 }*/
	 
	 setType(type){
		 this.type = type;
		 return type;
	 }
	
	 
	 setWeight(weight){
		 
		 this.weight = weight;
		 return this.weight;
	 }
	 setHeight(height){
		 this.height = height;
		 return this.height;
	 }
	 setDescription(description){
		 this.description = description;
		 return this.description;
	 }
	 
	
}

//Generate PackageId 
const generateID = () => Math.random().toString(36).slice(2);


//IMPROVED CODE
//Global Variables
const randomID = generateID();
let type = "1";
let weight = "";
let height= "";
let description = "";
let id = "";
let inputfieldtype = document.getElementById('selectPackageType');
let inputfieldweight = document.getElementById('floatWeight');
let inputfieldheight = document.getElementById('floatHeight');
let inputfielddescription = document.getElementById('description');


const dynamicId = ["selectPackageType","floatWeight","floatHeight","description"];

function updateValues(){
	var value = this.value;
	
	  if (value == null) {
	    console.log('value of packege is null');
	  } else 
		
	  	if (value != "" && (inputfieldtype == 'selectPackageType')){
				  type = value;	
				  		  
			  } else if (value != "" && (inputfieldweight == 'floatWeight')){
				  weight = value;
				  
			  } else if (value != "" && (inputfieldheight == 'floatHeight')){
				  height = value;
				  
			  } else if (value != "" && (inputfielddescription == 'description')){   
		   		  description = value;
		   		  
		   	  }
		 
	 }	
 
		inputfieldweight.addEventListener('change', updateValues );
		inputfieldheight.addEventListener('change', updateValues);
		inputfielddescription.addEventListener('change', updateValues);
	 	inputfieldtype.addEventListener('change', updateValues);

/*function updatedType() {
  var value = this.value;
  if (value == null) {
    console.log('type of packege is null');
  } else {
   type = value;
  }
}*/
// set things up again any time the selection of package type changes


// Restricts input for the given textbox to the given inputFilter.
/*function setInputFilter(textbox, inputFilter, errMsg) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function(event) {
    textbox.addEventListener(event, function(e) {
      if (inputFilter(this.value)) {
        // Accepted value
        if (["keydown","mousedown","focusout"].indexOf(e.type) >= 0){
          this.classList.remove("input-error");
          this.setCustomValidity("");
        }
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        // Rejected value - restore the previous one
        this.classList.add("input-error");
        this.setCustomValidity(errMsg);
        this.reportValidity();
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        // Rejected value - nothing to restore
        this.value = "";
      }
    });
  });
}

setInputFilter(document.getElementById(id), function(value) {
  return /^-?\d*[.,]?\d*$/.test(value); }, "Must be a floating (real) number");
  */
  
// set things up again any time the selection of package weight changes
 /*function updateWeight(){
	var value = this.value;
  if (value == null) {
    console.log('weight is null');
  } else {
   	 weight = value;
   	  console.log("das Gewicht beträgt" + weight);
 	}
 }
 
document.getElementById('floatWeight').addEventListener('change',updateWeight);

// set things up again any time the selection of package height changes
function updateHeight(){
	var value = this.value;
  if (value == null) {
    console.log('height is null');
  } else {
   	 height = value;
   	  console.log("die Höhe beträgt" + height);
 	}
 }

document.getElementById('floatHeight').addEventListener('change',updateHeight);

setInputFilter(document.getElementById("floatHeight"), function(value) {
  return /^-?\d*[.,]?\d*$/.test(value); }, "Must be a floating (real) number");
 // set things up again any time the selection of package description changes
function updateDescription(){
	var value = this.value;
  if (value == null) {
    console.log('height is null');
  } else {
   	 description = value;
   	  console.log("eine coole Beschreibung" + description);
 	}
 }

document.getElementById('description').addEventListener('change',updateDescription);
*/
//TODO Delete redundant Funktions!!!
// document.getElementById('dynamicId').addEventListener('change',dynamicValue);


//Create instance of package
const package = new Package();
//shoot all the values into one package
function submit(){	
  if (typeof package != "undefined") {
	  package.packageID = randomID;
	  package.type = type;
	  package.weight = weight; 
	  package.height = height;
	  package.description = description;   
      console.log(package);
  }else {
        console.log(package);
  }
}



	 
 
 
 