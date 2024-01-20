// Adicionar botão de remover luz
// Criar a função de adicionar sombra
// Adicionar o botão de remover sombra
// Ajustar a renderização da luz, quando adicionado.

var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        function mostrarAlerta() {
            alert("Criadores: Ravy 'agente37' Novais, Erick campos, shadowsilent, pom");
        }

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        document.body.appendChild(renderer.domElement);

        var geometriaAtual, objetoAtual;

        function adicionarForma(forma) {
            var geometry, material, mesh;

            switch (forma) {
                case 'quadrado':
                    geometry = new THREE.BoxGeometry(1, 1, 1);
                    break;
                case 'circulo':
                    geometry = new THREE.SphereGeometry(1, 32, 32);
                    break;
                case 'cilindro':
                    geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
                    break;
                case 'triangulo':
                    geometry = new THREE.TetrahedronGeometry(1);
                    break;
                default:
                    return;
            }

            geometriaAtual = geometry;
            material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
            objetoAtual = new THREE.Mesh(geometriaAtual, material);
            objetoAtual.castShadow = true;
            scene.add(objetoAtual);
        }

        function adicionarPlano() {
            var planoGeometry = new THREE.PlaneGeometry(10, 10, 10);
            var planoMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
            var plano = new THREE.Mesh(planoGeometry, planoMaterial);
            plano.rotation.x = Math.PI / 2;
            plano.receiveShadow = true;
            scene.add(plano);
        }

        function girarObjeto() {
            if (objetoAtual) {
                objetoAtual.rotation.x += 0.1;
                objetoAtual.rotation.y += 0.1;
            }
        }

        function moverObjeto() {
            var movimentoButtons = document.getElementById('movimento-buttons');
            movimentoButtons.style.display = 'block';
        }

        function moverObjetoDireita() {
            if (objetoAtual) {
                objetoAtual.position.x += 0.5;
            }
        }

        function moverObjetoEsquerda() {
            if (objetoAtual) {
                objetoAtual.position.x -= 0.5;
            }
        }

        function moverObjetoCima() {
            if (objetoAtual) {
                objetoAtual.position.y += 0.5;
            }
        }

        function moverObjetoBaixo() {
            if (objetoAtual) {
                objetoAtual.position.y -= 0.5;
            }
        }

        function adicionarLuz() {
            var luz = new THREE.PointLight(0xffffff, 1, 100);
            luz.position.set(0, 0, 5);
            luz.castShadow = true;
            scene.add(luz);
        }
        
        // Adicionar sombra aparentemente não funciona

        function adicionarSombra() {
            if (objetoAtual) {
                objetoAtual.castShadow = !objetoAtual.castShadow;
            }
        }

        function mostrarFormas() {
          
        }                   

        function mostrarMovimento() {
            var movimentoButtons = document.getElementById('movimento-buttons');
            movimentoButtons.style.display = 'flex';
        }

        function mudarCorObjeto() {
            var corSelecionada = document.getElementById('corObjeto').value;
            objetoAtual.material.color.set(corSelecionada);
            
            }

        var joystick = document.getElementById('joystick');
        var thumb = document.getElementById('joystick-thumb');
        var joystickActive = false;

        joystick.addEventListener('mousedown', function (e) {
            joystickActive = true;
            moveJoystick(e);
        });

        window.addEventListener('mousemove', function (e) {
            if (joystickActive) {
                moveJoystick(e);
            }
        });

        window.addEventListener('mouseup', function () {
            joystickActive = false;
            thumb.style.transform = 'translate(-50%, -50%)';
        });

        function moveJoystick(e) {
            var rect = joystick.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;

            var distance = Math.min(rect.width / 2, rect.height / 2);
            var angle = Math.atan2(y, x);
            var radius = Math.min(distance, Math.hypot(x, y));

            var thumbX = radius * Math.cos(angle);
            var thumbY = radius * Math.sin(angle);

            thumb.style.transform = `translate(${thumbX}px, ${thumbY}px)`;
        }

        var colorPicker = document.getElementById('color-picker');
        colorPicker.addEventListener('change', function () {
            mudarCorObjeto();
        });

        var animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

function exportarCena() {
  var cenaExportada = JSON.stringify(scene.toJSON());
  var arquivo = new Blob([cenaExportada], {type: "text/plain;charset=utf-8"});
  saveAs(arquivo, "cena.bl");
}

function importarCena() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.bl';
  input.onchange = function (event) {
    var arquivo = event.target.files[0];
    var leitor = new FileReader();
    leitor.onload = function (event) {
      var cenaImportada = JSON.parse(event.target.result);
      var objetoImportado = new THREE.ObjectLoader().parse(cenaImportada);
      scene.add(objetoImportado);
    };
    leitor.readAsText(arquivo);
  };
  input.click();
}
