document.addEventListener('DOMContentLoaded', function(){

    async function showHash(hashentry,name,hash256){
        document.querySelector('#render').innerHTML += 
        `
        <tr>
            <td>${hashentry}</td>
            <td>${name}</td>
            <td>${hash256}</td>
        </tr>
        `;
    }

    async function getSHA256(hash){
        const apikey = document.getElementById('vtkey').value;

        document.querySelector('#ihash').disabled = "true";
        document.body.style.cursor='wait';
        
        const options = {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'x-apikey': apikey
            }
        };
        try{
            let response = await fetch(`https://www.virustotal.com/api/v3/search?query=${hash}`, options)
            .then(response => response.json())
            .then(response => showHash(hash,response.data[0].attributes.meaningful_name,response.data[0].attributes.sha256, response.data[0].attributes.meaningful_name))
            
        } catch(err){
            showHash(hash,"no data","no data");
        }

        document.body.style.cursor='default';
        document.querySelector('#ihash').removeAttribute("disabled");
    }
    

    function readCSV(csv){

        let options = {separator:";"}
        let data = $.csv.toArrays(csv,options);
        data.shift();
        
        let interval = 5000; 
        data.forEach((hash,index)=>{
            setTimeout(()=>{
                getSHA256(hash);
            }, index * interval)
        })
    }

    document.querySelector("#submit").addEventListener('click', function(e){
        let hashtxt = document.getElementById('ihash').value;
        getSHA256(hashtxt);
    })

    document.querySelector('#loadcsv').addEventListener('change',function(e){

        let getFile = new FileReader();
        let file = document.querySelector('#loadcsv').files[0];

        getFile.onload= function(){
            readCSV(getFile.result)
        }
        getFile.readAsText(file);
    })

})