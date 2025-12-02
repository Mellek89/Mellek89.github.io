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
//Global Variables
const randomID = generateID();

const formgetInputfields = document.getElementById("getInputfields");
const inputfieldtype = document.getElementById('selectPackageType');
const inputfieldweight = document.getElementById('floatWeight');
const inputfieldheight = document.getElementById('floatHeight');
const inputfielddescription = document.getElementById('description');
const elements = ['floatWeight','floatHeight'];
//Create instance of package
const package = new Package();
//shoot all the values into one package
function submit(){	
const type = inputfieldtype.value;
const weight = inputfieldweight.value;
const height = inputfieldheight.value;
const description = inputfielddescription.value;
	
	
		
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
  

formgetInputfields.addEventListener("change", submit);
// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter, errMsg) {
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

for (let i = 0; i<= elements.length; i++ ){
setInputFilter(document.getElementById(elements[i]), function(value) {
  return /^-?\d*[.,]?\d*$/.test(value); }, "Must be a floating (real) number");
  
  }

