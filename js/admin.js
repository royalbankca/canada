// =======================================
// RBC ADMIN PANEL
// admin.js
// =======================================

let clients = [

{
id:"100001",
name:"Michael Johnson",
account:"CA4587458965412",
access:"4587",
password:"RBC2026",
phone:"+1 514 555 1001",
email:"michael@gmail.com",
address:"Montreal",
balance:45870
},

{
id:"100002",
name:"Rose Adjoavi",
account:"CA7745236987451",
access:"7412",
password:"Rose2026",
phone:"+22897554285",
email:"rose@gmail.com",
address:"Lomé",
balance:12430
},

{
id:"100003",
name:"Marc Koffi",
account:"CA9987456321458",
access:"3698",
password:"Marc2026",
phone:"+22990123456",
email:"marc@gmail.com",
address:"Cotonou",
balance:7980
}

];

function logout(){

localStorage.clear();

window.location.href="login.html";

}

function openCreateClient(){

document.getElementById("createClientModal").style.display="flex";

}

function closeCreateClient(){

document.getElementById("createClientModal").style.display="none";

}

function closeEditClient(){

document.getElementById("editClientModal").style.display="none";

}

function closeViewClient(){

document.getElementById("viewClientModal").style.display="none";

}
function createClient(){

const fullname=document.getElementById("fullname").value.trim();
const phone=document.getElementById("phone").value.trim();
const email=document.getElementById("email").value.trim();
const address=document.getElementById("address").value.trim();
const balance=document.getElementById("balance").value.trim();

if(fullname===""||phone===""||email===""){

alert("Veuillez remplir tous les champs.");

return;

}

const id=(100000+clients.length+1).toString();

const account="CA"+Math.floor(Math.random()*9000000000000+1000000000000);

const access=Math.floor(Math.random()*9000+1000).toString();

const password="RBC"+Math.floor(Math.random()*9000+1000);

const client={

id:id,
name:fullname,
account:account,
access:access,
password:password,
phone:phone,
email:email,
address:address,
balance:balance

};

clients.push(client);

addClientToTable(client);

localStorage.setItem("clients",JSON.stringify(clients));

alert(

"Compte créé avec succès.\n\n"+

"ID Client : "+id+

"\nCompte : "+account+

"\nCode d'accès : "+access+

"\nMot de passe : "+password

);

document.getElementById("fullname").value="";
document.getElementById("phone").value="";
document.getElementById("email").value="";
document.getElementById("address").value="";
document.getElementById("balance").value="0";

closeCreateClient();

document.getElementById("totalClients").innerHTML=clients.length;

}

function addClientToTable(client){

const table=document.getElementById("clientTable");

const row=table.insertRow();

row.innerHTML=`

<td>${client.id}</td>

<td>${client.name}</td>

<td>${client.account}</td>

<td>$${client.balance}</td>

<td>

<span class="status active">

Actif

</span>

</td>

<td>

<button class="edit" onclick="viewClient('${client.id}')">

Voir

</button>

<button class="delete" onclick="deleteClient('${client.id}',this)">

Supprimer

</button>

</td>

`;

}
function viewClient(id){

const client=clients.find(c=>c.id===id);

if(!client) return;

document.getElementById("infoName").innerHTML=client.name;
document.getElementById("infoClientID").innerHTML=client.id;
document.getElementById("infoAccount").innerHTML=client.account;
document.getElementById("infoAccess").innerHTML=client.access;
document.getElementById("infoPassword").innerHTML=client.password;
document.getElementById("infoPhone").innerHTML=client.phone;
document.getElementById("infoEmail").innerHTML=client.email;
document.getElementById("infoAddress").innerHTML=client.address;
document.getElementById("infoBalance").innerHTML="$"+client.balance;

document.getElementById("viewClientModal").style.display="flex";

}

function deleteClient(id,btn){

if(!confirm("Supprimer ce client ?")){

return;

}

clients=clients.filter(c=>c.id!==id);

localStorage.setItem("clients",JSON.stringify(clients));

const row=btn.parentElement.parentElement;

row.remove();

document.getElementById("totalClients").innerHTML=clients.length;

}

function openEditClient(id){

const client=clients.find(c=>c.id===id);

if(!client) return;

document.getElementById("editName").value=client.name;
document.getElementById("editAccount").value=client.account;
document.getElementById("editClientID").value=client.id;
document.getElementById("editAccess").value=client.access;
document.getElementById("editPassword").value=client.password;
document.getElementById("editBalance").value=client.balance;

document.getElementById("editClientModal").style.display="flex";

window.currentClient=id;

}

function saveClient(){

const id=window.currentClient;

const client=clients.find(c=>c.id===id);

if(!client){

return;

}

client.name=document.getElementById("editName").value;
client.account=document.getElementById("editAccount").value;
client.access=document.getElementById("editAccess").value;
client.password=document.getElementById("editPassword").value;
client.balance=document.getElementById("editBalance").value;

localStorage.setItem("clients",JSON.stringify(clients));

alert("Client modifié avec succès.");

location.reload();

}
// =======================================
// RECHERCHE CLIENT
// =======================================

const search=document.getElementById("search");

if(search){

search.addEventListener("keyup",function(){

const value=this.value.toLowerCase();

const rows=document.querySelectorAll("#clientTable tr");

rows.forEach(function(row){

const text=row.innerText.toLowerCase();

if(text.indexOf(value)>-1){

row.style.display="";

}else{

row.style.display="none";

}

});

});

}

// =======================================
// APPROUVER / REFUSER UNE DEMANDE
// =======================================

document.querySelectorAll(".approve").forEach(function(button){

button.addEventListener("click",function(){

const row=this.parentElement.parentElement;

const badge=row.querySelector(".status");

badge.className="status active";
badge.innerHTML="Approuvé";

this.disabled=true;

const reject=row.querySelector(".reject");

if(reject){

reject.disabled=true;

}

});

});

document.querySelectorAll(".reject").forEach(function(button){

button.addEventListener("click",function(){

const row=this.parentElement.parentElement;

const badge=row.querySelector(".status");

badge.className="status blocked";
badge.innerHTML="Refusé";

this.disabled=true;

const approve=row.querySelector(".approve");

if(approve){

approve.disabled=true;

}

});

});

// =======================================
// FERMETURE MODAL
// =======================================

window.onclick=function(event){

const create=document.getElementById("createClientModal");
const edit=document.getElementById("editClientModal");
const view=document.getElementById("viewClientModal");

if(event.target===create){

create.style.display="none";

}

if(event.target===edit){

edit.style.display="none";

}

if(event.target===view){

view.style.display="none";

}

};
// =======================================
// CHARGEMENT DES CLIENTS
// =======================================

window.addEventListener("load", function () {

    const data = localStorage.getItem("clients");

    if (data) {

        clients = JSON.parse(data);

        const table = document.getElementById("clientTable");

        if (table) {

            table.innerHTML = "";

            clients.forEach(function (client) {

                const row = table.insertRow();

                row.innerHTML = `

                <td>${client.id}</td>

                <td>${client.name}</td>

                <td>${client.account}</td>

                <td>$${client.balance}</td>

                <td>

                    <span class="status active">

                        Actif

                    </span>

                </td>

                <td>

                    <button class="edit"
                        onclick="viewClient('${client.id}')">

                        Voir

                    </button>

                    <button class="edit"
                        onclick="openEditClient('${client.id}')">

                        Modifier

                    </button>

                    <button class="delete"
                        onclick="deleteClient('${client.id}',this)">

                        Supprimer

                    </button>

                </td>

                `;

            });

        }

    }

    document.getElementById("totalClients").innerHTML = clients.length;

});

// =======================================
// ENREGISTREMENT AUTOMATIQUE
// =======================================

setInterval(function(){

    localStorage.setItem(
        "clients",
        JSON.stringify(clients)
    );

},1000);

// =======================================
// VÉRIFICATION ADMIN
// =======================================

if(localStorage.getItem("role")!=="admin"){

    alert("Accès refusé.");

    window.location.href="login.html";

}

// =======================================
// FIN
// =======================================
