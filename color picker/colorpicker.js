document.getElementById('btn').addEventListener('click', function () {
  let color = document.getElementById('color').value;
  let savedColors = document.getElementById('saved-colors');
  let colorlist = document.createElement('li');
  colorlist.innerHTML = color;
  savedColors.appendChild(colorlist);

  colorlist.innerHTML = `
        <input type="color" value="${color}" disabled> 
        <span onclick='copyColor(this)'>${color}</span> 
        <button onclick="RemoveColor(this)" class="remove">Remove</button>
    `;
  updatelocalStorage();
});

function RemoveColor(button) {
  button.parentElement.remove();
  updatelocalStorage();

}


function updatelocalStorage() {
  let colors = [];
  let colorlist = document.querySelectorAll('#saved-colors li');
  colorlist.forEach((item) => {
    let colorValue = item.querySelector('input').value;
    colors.push(colorValue);
  });
  localStorage.setItem('colors', JSON.stringify(colors));
}



function loadColors() {
  let colors = JSON.parse(localStorage.getItem('colors'));
  if (colors) {
    let savedColors = document.getElementById('saved-colors');
    colors.forEach((color) => {
      let colorlist = document.createElement('li');
      colorlist.innerHTML = `
        <input type="color" value="${color}" disabled> 
        <span onclick='copyColor(this)'>${color}</span> 
        <button onclick="RemoveColor(this)" class="remove">Remove</button>
    `;
      savedColors.appendChild(colorlist);
    });
  }
}

function copyColor(colorElement) {
  let text = color.innerText;
  navigator.clipboard.writeText(text);

  let copiedMessage = document.createElement('span');
  copiedMessage.textContent = 'Copied!';
  copiedMessage.classList.add('copied-message');

  colorElement.appendChild(copiedMessage);
  colorElement.style.color = '#4CAF50';
  colorElement.style.transform = 'scale(1.1)';

  setTimeout(() => {

    copiedMessage.remove();
    colorElement.style.color = '';
    colorElement.style.transform = '';
  }, 2000);
}



window.onload = loadColors;

function clearAllColors() {
  let savedColors = document.getElementById('saved-colors');
  savedColors.innerHTML = '';
  localStorage.removeItem('colors');
}

document.getElementById('imageUpload').addEventListener('change', function(event) {
  let file = event.target.files[0];
  if (!file) return;

  let img = new Image();
  let reader = new FileReader();

  reader.onload = function(e) {
      img.src = e.target.result;
  };

  img.onload = function() {
      let canvas = document.getElementById('imageCanvas');
      let ctx = canvas.getContext('2d');

      // ضبط حجم الكانفس ليكون بنفس حجم الصورة
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      extractColors(ctx, img.width, img.height);
  };

  reader.readAsDataURL(file);
});

function extractColors(ctx, width, height) {
  let colors = {};
  let sampleSize = 10; // عدد النقاط التي سنستخدمها لأخذ عينات من الألوان

  for (let y = 0; y < height; y += sampleSize) {
      for (let x = 0; x < width; x += sampleSize) {
          let pixel = ctx.getImageData(x, y, 2, 2).data;
          let color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

          if (!colors[color]) {
              colors[color] = 1;
          } else {
              colors[color]++;
          }
      }
  }

  let sortedColors = Object.keys(colors).sort((a, b) => colors[b] - colors[a]);
  displayExtractedColors(sortedColors.slice(0, 10)); // عرض أفضل 5 ألوان
}




function displayExtractedColors(colors) {
  let savedColors = document.getElementById('saved-colors');

  colors.forEach((color) => {
      let colorItem = document.createElement('li');
      colorItem.innerHTML = `
          <input type="color" value="${rgbToHex(color)}" disabled>
          <span onclick="copyColor(this)" class="color-text">${rgbToHex(color)}</span>
          <button onclick="RemoveColor(this)" class="remove">Remove</button>
      `;
      savedColors.appendChild(colorItem);
  });

  updatelocalStorage();
}

function rgbToHex(rgb) {
  let [r, g, b] = rgb.match(/\d+/g);
  return `#${((1 << 24) | (r << 16) | (g << 8) | +b).toString(16).slice(1)}`;
}



document.getElementById('imageUpload').addEventListener('change', function(event) {
  let file = event.target.files[0];

  let reader = new FileReader();

  reader.onload = function(e) {
      let img = document.getElementById('previewImage');
      img.src = e.target.result; 
  };

  reader.readAsDataURL(file);
});

