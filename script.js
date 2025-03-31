const canvas=document.querySelector("canvas"),
toolBtns=document.querySelectorAll(".tool"),
fillColor=document.querySelector("#fill-color"),
sizeSlider=document.querySelector("#size-slider"),
colorBtns=document.querySelectorAll(".colors .option"),
colorPicker=document.querySelector("#color-picker"),
clearCanvas=document.querySelector(".clear-canvas"),
saveImg=document.querySelector(".save-img"),
ctx=canvas.getContext("2d");

let preMouseX,preMouseY,snapshot,
isDrawing=false,
selectedTool="brush",
brushWidth=5,
selectedColor="#000";


const setCanvasBackground=()=>{
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedColor;
    
}
window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setCanvasBackground();
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
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
    snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);
}
const drawing=(e)=>{
    if(!isDrawing) return;
    ctx.putImageData(snapshot,0,0);

    if(selectedTool==="brush" || selectedTool=="eraser"){
        ctx.strokeStyle=selectedTool==="eraser"?"#fff":selectedColor;
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
        selectedColor=window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change",()=>{
    colorPicker.parentElement.style.background=colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBackground();
});


saveImg.addEventListener("click",()=>{
    const link=document.createElement("a");
    link.download=`${Date.now()}.jpg`;
    link.href=canvas.toDataURL();
    link.click();
});
canvas.addEventListener("mousedown",startDraw);
canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mouseup",()=>isDrawing=false);