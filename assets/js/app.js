var cl = console.log;

const stdform = document.getElementById("stdform");

const stdtable = document.getElementById("stdtable");

const stddata = document.getElementById("stddata");

const noinfo = document.getElementById("noinfo");

const fcontrol = document.getElementById("fname");

const lcontrol = document.getElementById("lname");

const econtrol = document.getElementById("email");

const ccontrol = document.getElementById("contact");

const updbtn = document.getElementById("updbtn");

const subbtn = document.getElementById("subbtn");


let stdarr = [];

const generateUuid = () => {
    return (
        String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
    ).replace(/[xy]/g, (character) => {
        const random = (Math.random() * 16) | 0;
        const value = character === "x" ? random : (random & 0x3) | 0x8;

        return value.toString(16);
    });
};

const handlestdcountstate = () =>{
	if(stdarr.length > 0){
		stdtable.classList.remove("d-none");
		noinfo.classList.add("d-none");
	}else{
		stdtable.classList.add("d-none");
		noinfo.classList.remove("d-none");
	}
}

handlestdcountstate();

const stdtemplating = (arr) =>{
	let result = "";
	
	arr.forEach((std,i) =>{
		result += `<tr id="${std.stdID}">
						<td>${i + 1}</td>
						<td>${std.fname}</td>
						<td>${std.lname}</td>
						<td>${std.email}</td>
						<td>${std.contact}</td>
						<td><i class="far fa-edit text-primary text-center" onclick = "onEdit(this)"></i></td>
						<td><i class="far fa-trash-alt text-danger text-center" onclick = "onDelete(this)"></i></td>
					</tr>`
	});
	
	stddata.innerHTML = result;
}

if(localStorage.getItem("stdInfo")){
	stdarr = JSON.parse(localStorage.getItem("stdInfo"));
	stdtemplating(stdarr);
}

handlestdcountstate();

const onEdit = (ele) =>{
	let editId = ele.closest("tr").id;
	cl(editId);
	localStorage.setItem("editId" , editId);
	let obj = stdarr.find(std => std.stdID === editId);
	fcontrol.value = obj.fname;
	lcontrol.value = obj.lname;
	econtrol.value = obj.email;
	ccontrol.value = obj.contact;
	cl(obj);
	updbtn.classList.remove("d-none");
	subbtn.classList.add("d-none");
}

const onDelete = (ele) =>{
	Swal.fire({
	  title: "Do you want to Remove Student Information?",
	  showCancelButton: true,
	  confirmButtonText: "Yes",
	}).then((result) => {
	  /* Read more about isConfirmed, isDenied below */
	  if (result.isConfirmed) {
		let deleId = ele.closest("tr").id;
		let getIndex = stdarr.findIndex(std => std.stdID === deleId);
		stdarr.splice(getIndex, 1);
		localStorage.setItem("stdInfo", JSON.stringify(stdarr));
		ele.closest("tr").remove();  
		Swal.fire("Removed successfully!", "", "success");
	  }
	});
}

const addstd = (obj) =>{
	let tr = document.createElement("tr");
	tr.id = obj.stdID;
	tr.innerHTML = `	<td>${1}</td>
						<td>${obj.fname}</td>
						<td>${obj.lname}</td>
						<td>${obj.email}</td>
						<td>${obj.contact}</td>
						<td><i class="far fa-edit text-primary text-center" onclick = "onEdit(this)"></i></td>
						<td><i class="far fa-trash-alt text-danger text-center" onclick = "onDelete(this)"></i></td>`;
	stddata.prepend(tr);
	let alltr = [...stddata.children]
	for(let i = 0; i < stdarr.length; i++){
		alltr[i].firstElementChild.innerHTML = i + 1;
	}
}

const stdformadd = (e) =>{
	e.preventDefault();
	let newstd = {
		fname : fcontrol.value,
		lname : lcontrol.value,
		email : econtrol.value,
		contact : ccontrol.value,
		stdID : generateUuid()
	}
	stdarr.unshift(newstd);
	localStorage.setItem("stdInfo", JSON.stringify(stdarr));
	handlestdcountstate();
	//stdtemplating(stdarr);
	addstd(newstd)
	e.target.reset();
	Swal.fire({
		title:`${newstd.fname} ${newstd.lname} added successfully !!!!`,
		timer:2500,
	})
};

const onStdUpd = () =>{
	let updId = localStorage.getItem("editId");
	let updobj = {
		fname : fcontrol.value,
		lname : lcontrol.value,
		email : econtrol.value,
		contact : ccontrol.value,
	};
	let getIndex = stdarr.findIndex(std => std.stdID === updId);
	stdarr[getIndex] = updobj;
	localStorage.setItem("stdInfo", JSON.stringify(stdarr));
	let tr = [...document.getElementById(updId).children];
	tr[1].innerHTML = updId.fname;
	tr[2].innerHTML = updId.lname;
	tr[3].innerHTML = updId.email;
	tr[4].innerHTML = updId.contact;
	stdformadd.reset();
	updbtn.classList.add("d-none");
	subbtn.classList.remove("d-none");
}


stdform.addEventListener("submit", stdformadd);

updbtn.addEventListener("click", onStdUpd);