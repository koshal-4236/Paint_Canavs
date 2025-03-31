const canvas=document.querySelector("canvas"),
toolBtns=document.querySelectorAll(".tool"),
fillColor=document.querySelector("#fill-color"),
sizeSlider=document.querySelector("#size-slider"),
colorBtns=document.querySelectorAll(".colors .option"),
ctx=canvas.getContext("2d");

let preMouseX,preMouseY,snapshot,
isDrawing=false,
selectedTool="brush",
brushWidth=5;
selectedColor="#000";

window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
});

const drawRect=(e)=>{
    if(!fillColor.checked){
    return ctx.strokeRect(e.offsetX,e.offsetY,preMouseX-e.offsetX,preMouseY-e.offsetY);
    }
    ctx.fillRect(e.offsetX,e.offsetY,preMouseX-e.offsetX,preMouseY-e.offsetY);
}

const drawCircle=(e)=>{
    ctx.beginPath();
    let radius=Math.sqrt(Math.pow((preMouseX-e.offsetX),2)+Math.pow((preMouseY-e.offsetY),2));
    ctx.arc(preMouseX,preMouseY,radius,0,2*Math.PI);
    fillColor.checked?ctx.fill():ctx.stroke();
}

const drawTri=(e)=>{
    ctx.beginPath();
    ctx.moveTo(preMouseX,preMouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.lineTo(preMouseX*2-e.offsetX,e.offsetY);
    ctx.closePath();
    fillColor.checked?ctx.fill():ctx.stroke();
}

const startDraw=(e)=>{
    isDrawing=true;
    preMouseX=e.offsetX;
    preMouseY=e.offsetY;
    ctx.beginPath();
    ctx.lineWidth=brushWidth;
    snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);
}
const drawing=(e)=>{
    if(!isDrawing) return;
    ctx.putImageData(snapshot,0,0);

    if(selectedTool==="brush"){
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.stroke();
    }

    else if(selectedTool==="rectangle")
    {
        drawRect(e);
    }
    else if(selectedTool==="circle")
    {
        drawCircle(e);
    }
    else{
        drawTri(e);
    }
}

toolBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .active ").classList.remove("active");
        btn.classList.add("active");
        selectedTool=btn.id;
        console.log(btn);
    });
});

sizeSlider.addEventListener("change",()=>brushWidth=sizeSlider.value);

colorBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .selected ").classList.remove("selected");
        btn.classList.add("selected");
        console.log(window.getComputedStyle(btn).getPropertyValue("background-color"));
    });
});

canvas.addEventListener("mousedown",startDraw);
canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mouseup",()=>isDrawing=false);