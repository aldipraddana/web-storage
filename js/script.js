function isStorageExist() {
   if(typeof(Storage) === undefined){
       alert("Browser kamu tidak mendukung local storage");
       return false
   }
   return true;
}

function launch_toast(message) {
    var x = document.getElementById("toast")
    document.getElementById('desc').innerText = message
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function save(master) {
  localStorage.setItem('LS_ALDI', JSON.stringify(master))
}

function renderElement(judul, penulis, tahun, status, id) {
  if (status == 'Belum Dilakukan') {
    isCompleted = false
  }else {
    isCompleted = true
  }
  return `<div class="item shadow">
            <div class="inner">
              <h2 class="kapital">${judul}</h2>
              <table style="margin-bottom:10px;margin-left:-5px;">
                <tr>
                  <td>Penulis</td>
                  <td>:</td>
                  <td class="kapital"> ${penulis}</td>
                </tr>
                <tr>
                  <td>Tahun</td>
                  <td>:</td>
                  <td> ${tahun}</td>
                </tr>
              </table>
            </div>
            <div class="area-button">
             <button class="btn check-button" onclick="ehem_update(${id}, ${isCompleted}, this)" style="width:65%">${status}</button>
             <button class="del" style="width:29%;margin-left:7px;" onclick="ehem(${id}, this)">Hapus</button>
            </div>
          </div>`;
}

function getAllData() {
  if (isStorageExist()) {
    let master = JSON.parse(localStorage.getItem('LS_ALDI'))
    let complated = [];
    let unComplated = [];
    if (master != null) {
      master.forEach((v,i)=>{
        if (v.isComplete) {
          complated.push(renderElement(v.title, v.author, v.year, 'Belum Dilakukan', v.id));
        }else {
          unComplated.push(renderElement(v.title, v.author, v.year, 'Selesai Dilakukan', v.id));
        }
      })
      document.querySelector('.s').innerHTML=complated.join('');
      document.querySelector('.bs').innerHTML=unComplated.join('');
    }
  }
}

function ehem(param, th) {
  let master = JSON.parse(localStorage.getItem('LS_ALDI'))
  console.log(param);
  master.forEach((v, i) => {
    if (v.id == param) {
      master.splice(i,1)
    }
  })
  save(master)
  th.parentElement.parentElement.remove()
  launch_toast('Berhasil menghapus data')
}

function ehem_update(param, isCompleted, th) {
  let master = JSON.parse(localStorage.getItem('LS_ALDI'))
  master.forEach((v, i) => {
    if (v.id == param) {
      master[i].isComplete = isCompleted
    }
  })

  let element_ = th.parentElement.parentElement;

  if (isCompleted) {
    element_.querySelector('.btn').innerHTML = 'Belum Dilakukan'
    element_.querySelector('.btn').setAttribute('onclick', `ehem_update(${param}, false, this)`)
    document.querySelector('.s').append(element_)
  }else {
    element_.querySelector('.btn').innerHTML = 'Selesai Dilakukan'
    element_.querySelector('.btn').setAttribute('onclick', `ehem_update(${param}, true, this)`)
    document.querySelector('.bs').append(element_)
  }
  save(master);
  launch_toast('Berhasil memindah data')

}

function stringToHTML(str) {
  var dom = document.createElement('div')
  dom.innerHTML = str
  return dom
}

function search() {
  let all = document.querySelectorAll('.item')
  let param = document.getElementById('search_param').value.toLowerCase()
  all.forEach((v,i)=>{
    let val = v.querySelector('h2').innerText.toLowerCase()
    if (val.includes(param)) {
      v.setAttribute('style', '');
    }else {
      v.setAttribute('style', 'display:none');
    }
  })
}

document.addEventListener("DOMContentLoaded", function () {
  getAllData();
  document.getElementById("form").addEventListener("submit", function (event) {
      event.preventDefault();
      const judul = document.getElementById('judul').value
      const penulis = document.getElementById('penulis').value
      const tahun = document.getElementById('tahun').value
      const selesaiDilakukan = document.getElementById('check').checked

      let newObeject = {
        id: +new Date(),
        title: judul,
        author: penulis,
        year: tahun,
        isComplete: selesaiDilakukan,
      }

      if (isStorageExist()) {
        let master_before = JSON.parse(localStorage.getItem('LS_ALDI'))
        if (master_before == null) {
          let tampung = [];
          tampung.push(newObeject)
          save(tampung);
        }else {
          master_before.push(newObeject)
          save(master_before)
        }
      }
      let newElement = renderElement(newObeject.title, newObeject.author, newObeject.year, newObeject.isComplete ? 'Belum Dilakukan' : 'Selesai Dilakukan', newObeject.id)
      newElement = stringToHTML(newElement);
      console.log(newElement);
      if (newObeject.isComplete) {
        document.querySelector('.s').append(newElement)
      }else {
        document.querySelector('.bs').append(newElement)
      }

      launch_toast('Berhasil menyimpan data')
      document.getElementById("form").reset()

  });

  document.getElementById('check').addEventListener("change", function() {
    if (this.checked) {
      document.getElementsByName('Submit')[0].value = 'Masukan buku di rak sudah selesai'
    }else {
      document.getElementsByName('Submit')[0].value = 'Masukan buku di rak belum selesai'
    }
  })


});
