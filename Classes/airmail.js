

//Generate PackageId Date plus random String
const generateID = () => Math.random().toString(36).slice(2);
const randomID = generateID();
let date = new Date();

const uniqueID = date.setHours(7) + randomID;
console.log(uniqueID);


 const inputfieldweight = document.getElementById('floatWeight');
 const inputfieldheight = document.getElementById('floatHeight');
 const inputfieldwidth = document.getElementById('floatWidth');
 const inputfieldlength = document.getElementById('floatLength');


 const inputfielddescription = document.getElementById('description');

 const formgetInputfields = document.getElementById("getInputfields");
// const packageButton = document.getElementById("sendPackage");
 const letterButton = document.getElementById("sendLetter");
 const formPackage = document.getElementById("formPackage");
 const formLetter = document.getElementById("formLetter");
 var displayPackage = $('#formPackage').css('display');
 var displayLetter = $('#formLetter').css('display');
  
 formgetInputfields.addEventListener("submit", (e) => {
     
        e.preventDefault();
       
        console.log(inputfieldweight.value);
        console.log(inputfieldheight.value);
        console.log(inputfieldwidth.value);
        console.log(inputfieldlength.value);
        console.log(inputfielddescription.value);
        document.getElementById("getInputfields").reset();
    });

    export { inputfieldweight, inputfieldheight,      
            inputfieldwidth, inputfieldlength, inputfielddescription,
             formgetInputfields, uniqueID}         
    
 /* const selectItemToBeSend = () =>{
   
       packageButton.addEventListener("click", () => {
                     
              if((displayPackage == 'none' && displayLetter == 'none') || (displayLetter == 'block' && displayPackage == 'none')){
                $('#formPackage').show();
                $('#formLetter').hide();
                displayPackage = 'block';
                displayLetter = 'none';
              } else if (displayPackage =='block' && displayLetter == 'none') {
                $('#formPackage').hide();
                displayPackage = 'none';
              } 
               
      });
   
        
        letterButton.addEventListener("click", () => {
               
          if((displayLetter == 'none' && displayPackage == 'none')||(displayPackage =='block' && displayLetter== 'none')){
            $('#formLetter').show();
            $('#formPackage').hide();
            displayLetter = 'block';
            displayPackage = 'none'
          } else if (displayLetter =='block' && displayPackage == 'none'){
            $('#formLetter').hide();
            displayLetter = 'none';
          } 
          
      });

 }
  selectItemToBeSend();*/

            

    
    







