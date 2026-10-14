const form = document.getElementById("formDaftar");
if(form){
form.addEventListener("submit",function(e){
     e.preventDefault();
     let nama=document.getElementById("nama").value;
     let wa=document.getElementById("wa").value;
     let msg=document.getElementById("msg");
if(nama==""||wa==""){
     msg.style.color="#f87171";
     msg.innerText="Nama dan WA wajib diisi!";
return;
}

if(wa.length<10){
     msg.style.color="#f87171";
     msg.innerText="No WA minimal 10 angka!";
return;
}

msg.style.color="#4ade80";
msg.innerText="Makasih "+nama+"! Pendaftaran berhasil, cek WA ya.";
form.reset();
});
}

window.addEventListener("scroll",()=>{
     const h=document.querySelector("header");
     if(window.scrollY>10)h.classList.add("shadow-lg");
     else h.classList.remove("shadow-lg");
}); 