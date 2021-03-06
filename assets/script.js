const baseUrl = "https://el-geladon-backend-by-ip.herokuapp.com/paletas";

async function findAllPaletas() {
  const response = await fetch(`${baseUrl}/find-paletas`);

  const paletas = await response.json();
  console.log(paletas);

  paletas.forEach((paleta) => {
    document.getElementById("paletaList").insertAdjacentHTML(
      "beforeend",`
    <div class="PaletaListaItem" id="PaletaListaItem_${paleta._id}">
        <div>
            <div class="PaletaListaItem__id">${paleta._id}</div>
            <div class="PaletaListaItem__sabor">${paleta.sabor}</div>
            <div class="PaletaListaItem__preco">R$ ${paleta.preco}</div>
            <div class="PaletaListaItem__descricao">${paleta.descricao}</div>
            <div class="PaletaListaItem__acoes Acoes">
              <button class="Acoes__editar" onclick="abrirModalCadastro('${paleta._id}')">editar</button>
              <button class="Acoes__deletar" onclick="abrirModalDelete('${paleta._id}')">deletar</button>
            </div>
        </div>
            <img class="PaletaListaItem__foto" src=${
              paleta.foto
            } alt=${`Paleta de ${paleta.sabor}`} />
    </div>`
    );
  });
};

findAllPaletas();

async function findPaletaById() {
    const id = document.getElementById("idPaleta").value;
    const response = await fetch(`${baseUrl}/find-paleta/${id}`);
    const paleta = await response.json();
  
    const paletaEscolhidaDiv = document.getElementById("paletaEscolhida");
  
    paletaEscolhidaDiv.innerHTML = `
    <div class="PaletaListaItem" id="PaletaListaItem_${paleta._id}>
      <div>
        // <div class="PaletaListaItem__id">${paleta._id}</div>
        <div class="PaletaListaItem__sabor">${paleta.sabor}</div>
        <div class="PaletaListaItem__preco">R$ ${paleta.preco}</div>
        <div class="PaletaListaItem__descricao">${paleta.descricao}</div>
      </div>
        <div class="PaletaListaItem__acoes Acoes">
              <button class="Acoes__editar" onclick="abrirModalCadastro('${paleta._id}')">editar</button>
              <button class="Acoes__deletar" onclick="abrirModalDelete('${paleta._id}')">deletar</button>
        </div>
        <img class="PaletaListaItem__foto" src=${
          paleta.foto
        } alt=${`Paleta de ${paleta.sabor}`} />
    </div>`;
  };

async function abrirModalCadastro(id = null) {
    if (id != null) {
      document.querySelector("#title-header-modal").innerText = "Atualizar Paleta";
      document.querySelector("#button-form-modal").innerText = "Atualizar";

      const response = await fetch(`${baseUrl}/find-paleta/${id}`);
      const paleta = await response.json();

      
      const sabor = document.querySelector("#sabor").value = paleta.sabor;
      const preco = document.querySelector("#preco").value = paleta.preco;
      const descricao = document.querySelector("#descricao").value = paleta.descricao;
      const foto = document.querySelector("#foto").value = paleta.foto;
      document.querySelector("#id").value = paleta._id;

    }else {
      document.querySelector("#title-header-modal").innerText = "Cadastrar Paleta";
      document.querySelector("#button-form-modal").innerText = "Cadastrar";
    }


    document.querySelector("#overlay").style.display = "flex";
  }
  
  function fecharModal() {
    document.querySelector(".modal-overlay").style.display = "none";
    document.querySelector("#sabor").value = "";
    document.querySelector("#preco").value = 0;
    document.querySelector("#descricao").value = "";
    document.querySelector("#foto").value = "";
  }

  async function createPaleta() {
    const id = document.querySelector("#id").value;
    const sabor = document.querySelector("#sabor").value;
    const preco = document.querySelector("#preco").value;
    const descricao = document.querySelector("#descricao").value;
    const foto = document.querySelector("#foto").value;
  
    const paleta = {
      id,
      sabor,
      preco,
      descricao,
      foto,
    };
  
    const modoEdicaoAtivado = !!id;
    const endpoint = baseUrl + (modoEdicaoAtivado ? `/update/${id}` : 
    '/create');
  
    const response = await fetch(endpoint, {
      method: modoEdicaoAtivado ? "put" : "post",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(paleta),
    });
    
      const novaPaleta = await response.json();
      let isEdit = true;
      const html = `
    <div class="PaletaListaItem" id="PaletaListaItem_${novaPaleta._id}">
        <div>
            <div class="PaletaListaItem__id">${paleta._id}</div>
            <div class="PaletaListaItem__sabor">${novaPaleta.sabor}</div>
            <div class="PaletaListaItem__preco">R$ ${novaPaleta.preco}</div>
            <div class="PaletaListaItem__descricao">${novaPaleta.descricao}</div>
            <div class="PaletaListaItem__acoes Acoes">
                <button class="Acoes__editar" onclick="editPaleta(${novaPaleta._id})">editar</button>
                <button class="Acoes__deletar" onclick="abrirModalDelete('${novaPaleta._id}')">deletar</button>
            </div>
        </div>
            <img class="PaletaListaItem__foto" src=${novaPaleta.foto} alt=${`Paleta de ${novaPaleta.sabor}`} />
    </div>`;

    
    if (modoEdicaoAtivado) {
        document.querySelector(`#PaletaListaItem_${id}`).outerHTML = html;
        alert("Paleta editada com sucesso!");
      } else {
        document.getElementById("paletaList").insertAdjacentHTML("beforeend", html);
      }

    document.getElementById("id").value = "";

    fecharModal();
    document.location.reload(true);
  
      
  };

  function abrirModalDelete(id) {
    document.querySelector("#overlay-delete").style.display = "flex";
    const btnSim = document.querySelector(".btn_delete_yes");
    btnSim.addEventListener("click", function() {
      deletePaleta(id);
    })
  }

  function fecharModalDelete() {
    document.querySelector("#overlay-delete").style.display = "none";      
  }

  async function deletePaleta(id) {
    const response = await fetch(`${baseUrl}/delete/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    const result = await response.json();
    alert(result.message)
    document.getElementById("paletaList").innerHTML = ""
    fecharModalDelete();
    findAllPaletas();
  };