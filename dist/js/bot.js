import { API } from "./api.js";
var ticket = document.getElementById("open-ticket");
var send = document.getElementById("send-message");
var input = document.getElementById("question");
var chatArea = document.getElementById("chat-area");
var hist = "";
var inArea = document.getElementById("inArea");
var popup = document.getElementById("e-helper");
var chatBtn = document.getElementById("e-helper-trigger");
var closeBtn = document.getElementById("close");
var minimizeBtn = document.getElementById("minimize");
var starterFlag = true;
var ticketFlag = false;
var retProto = false;
var authKey = "";
var bot = {
    Alias: "bot-test",
    Passcode: "abacaxi" //insert here the passcode of your bot (non hardcoded)    
};
send.onclick = testQ;
chatBtn.addEventListener("click", async () => {
    popup.style.display = "flex";
    if (starterFlag) {
        let r = await API.login(bot);
        authKey = r.token;
        testQ();
        starterFlag = false;
    }
});
closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
    hist = "";
    chatArea.innerHTML = "";
    authKey = "";
    starterFlag = true;
});
minimizeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});
input.onkeydown = async function () {
    if (event.key == "Enter") {
        testQ();
    }
};
async function testQ() {
    let message = input.value;
    let elm = "";
    if (!starterFlag && !ticketFlag) {
        hist = hist + message + "\n";
        elm = `<div class="out-msg"><span class="msg">${message}</span></div>`;
        chatArea.insertAdjacentHTML("beforeend", elm);
        input.value = "";
        if (message.toLowerCase() == "protocolo") {
            retProto = true;
            elm = `<div class="income-msg"><span class="msg">Por favor, informe o número do protocolo que você deseja acompanhar.</span></div>`;
            chatArea.insertAdjacentHTML("beforeend", elm);
            hist = hist + `Por favor, informe o número do protocolo que você deseja acompanhar.` + "\n";
            return;
        }
        else if (retProto) {
            let ticketContent = {
                target: "r",
                proto: message
            };
            let q = {
                data: ticketContent
            };
            let resp = await API.ticket(q, authKey);
            if (resp.resp == undefined) {
                elm = `<div class="income-msg"><span class="msg">Desculpe, mas não conseguimos encontrar no nosso banco de dados o protocolo informado. Caso queira tentar novamente, digite "Protocolo" e assegure-se de que digitou os números corretamente. Caso queira abrir um chamado, basta pressionar o símbolo de envelope ao lado do botão de envio de mensagens e preencher o formulário.</span></div>`;
                chatArea.insertAdjacentHTML("beforeend", elm);
                hist = hist + `Desculpe, mas não conseguimos encontrar no nosso banco de dados o protocolo informado. Caso queira tentar novamente, digite "Protocolo" e assegure-se de que digitou os números corretamente. Caso queira abrir um chamado, basta pressionar o símbolo de envelope ao lado do botão de envio de mensagens e preencher o formulário.` + "\n";
            }
            else {
                if (resp.status == "O") {
                    resp.status = "Aberto";
                }
                else if (resp.status == "C") {
                    resp.status = "Fechado";
                }
                else if (resp.status == "P") {
                    resp.status = "Em processamento";
                }
                if (resp.resp == "") {
                    resp.resp = "Seu chamado ainda não começou a ser processado por nenhum de nossos operadores. Solicitamos que aguarde mais um pouco e agradeçemos a sua paciência.";
                }
                elm = `<div class="income-msg"><span class="msg">O status do seu chamado de número ${message} é: ${resp.status}.</span></div>`;
                chatArea.insertAdjacentHTML("beforeend", elm);
                hist = hist + `O status do seu chamado de número ${message} é: ${resp.status}.\n${resp.resp}` + "\n";
                elm = `<div class="income-msg"><span class="msg" style="white-space: pre-line">${resp.resp}</span></div>`;
                chatArea.insertAdjacentHTML("beforeend", elm);
            }
            retProto = false;
            return;
        }
    }
    let q = {
        data: { Question: message, intro: starterFlag, ticket: ticketFlag, alias: bot.Alias }
    };
    let responses = await API.testQ(q, authKey);
    if (!ticketFlag) {
        for (let r of responses.data) {
            if (r.includes("|Q|")) {
                r = r.slice(0, -3);
                elm = `<div class="interactive-question">
                    <button class="interactive" onclick="{
                        document.getElementById('question').value = this.innerText
                        document.getElementById('send-message').click()
                    }"><b>${r}</b></button>
                    </div>`;
            }
            else {
                elm = `<div class="income-msg"><span class="msg">${r}</span></div>`;
            }
            hist = hist + r + "\n";
            chatArea.insertAdjacentHTML("beforeend", elm);
        }
    }
    else {
        elm = `<div class="ticket-form">` + responses.data[0] + `<textarea id="reason" placeholder="Insira a razão do contato" class="textareas"></textarea>
                                 <div class="form-btn">
                                     <button class="form-operators" id="form-cancel" style="margin-right: 20px;">CANCELAR</button>
                                     <button class="form-operators" id="form-send" style="margin-left: 20px;">CONFIRMAR</button>
                                 </div>
                            </div>`;
        chatArea.innerHTML = elm;
        chatArea.style.height = "100%";
        let formSend = document.getElementById("form-send");
        let formCancel = document.getElementById("form-cancel");
        formSend.addEventListener('click', async () => {
            let formList = document.getElementsByClassName(".inputs");
            let reason = document.getElementById("reason");
            let cinfo = "";
            for (let f of formList) {
                cinfo = cinfo + f.value + "/&/";
            }
            cinfo = cinfo + /&/ + reason.value;
            let ticketContent = {
                target: "c",
                info: {
                    origin: "teste1",
                    chat: hist,
                    cinfo: cinfo,
                    alias: bot.Alias
                }
            };
            let q = {
                data: ticketContent
            };
            let resp = await API.ticket(q, authKey);
            elm = `<div class="income-msg"><span class="msg">Agradecemos o contato. O seu chamado foi aberto e será analisado em breve por um de nossos operadores. Seu protocolo é: ${resp.proto}. Caso queira acompanhar o andamento do seu chamado, basta digitar "Protocolo" e fornecer esse número quando solicitado.</span></div>`;
            chatArea.innerHTML = "";
            chatArea.insertAdjacentHTML("beforeend", elm);
            hist = "Em que mais eu posso ajudar?\n";
            elm = `<div class="income-msg"><span class="msg">Em que mais eu posso ajudar?</span></div>`;
            chatArea.insertAdjacentHTML("beforeend", elm);
            ticketFlag = false;
            inArea.style.display = "flex";
            chatArea.style.height = "90%";
        });
        formCancel.addEventListener('click', async () => {
            elm = `<div class="income-msg"><span class="msg">A abertura de chamado foi cancelada. Em que mais eu posso te ajudar?</span></div>`;
            chatArea.innerHTML = "";
            chatArea.insertAdjacentHTML("beforeend", elm);
            hist = hist + "A abertura de chamado foi cancelada. Em que mais eu posso te ajudar?\n";
            ticketFlag = false;
            inArea.style.display = "flex";
            chatArea.style.height = "90%";
        });
    }
    chatArea.scrollTop = chatArea.scrollHeight;
}
ticket.addEventListener("click", async () => {
    inArea.style.display = "none";
    ticketFlag = true;
    testQ();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvYm90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxHQUFHLEVBQXNELE1BQU0sVUFBVSxDQUFBO0FBRWpGLElBQUksTUFBTSxHQUF3QyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ3hGLElBQUksSUFBSSxHQUF3QyxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3ZGLElBQUksS0FBSyxHQUFzQyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ2xGLElBQUksUUFBUSxHQUFrQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ2xGLElBQUksSUFBSSxHQUFVLEVBQUUsQ0FBQTtBQUNwQixJQUFJLE1BQU0sR0FBa0MsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM3RSxJQUFJLEtBQUssR0FBa0MsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUM5RSxJQUFJLE9BQU8sR0FBc0MsUUFBUSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0FBQzVGLElBQUksUUFBUSxHQUF3QyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BGLElBQUksV0FBVyxHQUF3QyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzFGLElBQUksV0FBVyxHQUFXLElBQUksQ0FBQTtBQUM5QixJQUFJLFVBQVUsR0FBVyxLQUFLLENBQUE7QUFDOUIsSUFBSSxRQUFRLEdBQVcsS0FBSyxDQUFBO0FBQzVCLElBQUksT0FBTyxHQUFVLEVBQUUsQ0FBQTtBQUN2QixJQUFJLEdBQUcsR0FBTztJQUNWLEtBQUssRUFBRSxVQUFVO0lBQ2pCLFFBQVEsRUFBRSxTQUFTLENBQUMsMERBQTBEO0NBQ2pGLENBQUE7QUFDRCxJQUFJ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QUFJLEdBQUcsd0VBQXdFLENBQUE7WUFDdEYsVUFBVSxHQUFHLEtBQUssQ0FBQTtZQUNsQixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUE7WUFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO1FBQ2pDLENBQUMsQ0FBQyxDQUFBO0tBQ0w7SUFDRCxRQUFRLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUE7QUFDOUMsQ0FBQztBQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFHLEVBQUU7SUFDdkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBO0lBQzdCLFVBQVUsR0FBRyxJQUFJLENBQUE7SUFDakIsS0FBSyxFQUFFLENBQUE7QUFDWCxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QVBJLCBCb3QsIEJvdFJlcXVlc3QsIFF1ZXN0aW9uLCBPVGlja2V0LCBUaWNrZXQsIFJUaWNrZXR9IGZyb20gXCIuL2FwaS5qc1wiXHJcblxyXG52YXIgdGlja2V0OkhUTUxCdXR0b25FbGVtZW50ID0gPEhUTUxCdXR0b25FbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Blbi10aWNrZXRcIilcclxudmFyIHNlbmQ6SFRNTEJ1dHRvbkVsZW1lbnQgPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZW5kLW1lc3NhZ2VcIilcclxudmFyIGlucHV0OkhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInF1ZXN0aW9uXCIpXHJcbnZhciBjaGF0QXJlYTpIVE1MRGl2RWxlbWVudCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXQtYXJlYVwiKVxyXG52YXIgaGlzdDpzdHJpbmcgPSBcIlwiXHJcbnZhciBpbkFyZWE6SFRNTERpdkVsZW1lbnQgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbkFyZWFcIilcclxudmFyIHBvcHVwOkhUTUxEaXZFbGVtZW50ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZS1oZWxwZXJcIilcclxudmFyIGNoYXRCdG46SFRNTEltYWdlRWxlbWVudCA9IDxIVE1MSW1hZ2VFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZS1oZWxwZXItdHJpZ2dlclwiKVxyXG52YXIgY2xvc2VCdG46SFRNTEJ1dHRvbkVsZW1lbnQgPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbG9zZVwiKVxyXG52YXIgbWluaW1pemVCdG46SFRNTEJ1dHRvbkVsZW1lbnQgPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtaW5pbWl6ZVwiKVxyXG52YXIgc3RhcnRlckZsYWc6Ym9vbGVhbiA9IHRydWVcclxudmFyIHRpY2tldEZsYWc6Ym9vbGVhbiA9IGZhbHNlXHJcbnZhciByZXRQcm90bzpib29sZWFuID0gZmFsc2VcclxudmFyIGF1dGhLZXk6c3RyaW5nID0gXCJcIlxyXG52YXIgYm90OkJvdCA9IHtcclxuICAgIEFsaWFzOiBcImJvdC10ZXN0XCIsIC8vaW5zZXJ0IGhlcmUgdGhlIGFsaWFzIG9mIHlvdXIgYm90IChub24gaGFyZGNvZGVkKVxyXG4gICAgUGFzc2NvZGU6IFwiYWJhY2F4aVwiIC8vaW5zZXJ0IGhlcmUgdGhlIHBhc3Njb2RlIG9mIHlvdXIgYm90IChub24gaGFyZGNvZGVkKSAgICBcclxufVxyXG5zZW5kLm9uY2xpY2sgPSB0ZXN0UVxyXG5jaGF0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKT0+e1xyXG4gICAgcG9wdXAuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiXHJcbiAgICBpZiAoc3RhcnRlckZsYWcpIHtcclxuICAgICAgICBsZXQgciA9IGF3YWl0IEFQSS5sb2dpbihib3QpXHJcbiAgICAgICAgYXV0aEtleSA9IHIudG9rZW5cclxuICAgICAgICB0ZXN0USgpXHJcbiAgICAgICAgc3RhcnRlckZsYWcgPSBmYWxzZVxyXG4gICAgfVxyXG59KVxyXG5cclxuY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XHJcbiAgICBwb3B1cC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICAgIGhpc3QgPSBcIlwiXHJcbiAgICBjaGF0QXJlYS5pbm5lckhUTUwgPSBcIlwiXHJcbiAgICBhdXRoS2V5ID0gXCJcIlxyXG4gICAgc3RhcnRlckZsYWcgPSB0cnVlXHJcbn0pXHJcblxyXG5taW5pbWl6ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcclxuICAgIHBvcHVwLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG59KVxyXG5cclxuaW5wdXQub25rZXlkb3duID0gYXN5bmMgZnVuY3Rpb24oKXtcclxuICAgIGlmKGV2ZW50LmtleSA9PSBcIkVudGVyXCIpe1xyXG4gICAgICAgIHRlc3RRKClcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gdGVzdFEoKSB7XHJcbiAgICBsZXQgbWVzc2FnZSA9IGlucHV0LnZhbHVlXHJcbiAgICBsZXQgZWxtID0gXCJcIlxyXG4gICAgaWYgKCFzdGFydGVyRmxhZyAmJiAhdGlja2V0RmxhZykge1xyXG4gICAgICAgIGhpc3QgPSBoaXN0K21lc3NhZ2UrXCJcXG5cIlxyXG4gICAgICAgIGVsbSA9IGA8ZGl2IGNsYXNzPVwib3V0LW1zZ1wiPjxzcGFuIGNsYXNzPVwibXNnXCI+JHttZXNzYWdlfTwvc3Bhbj48L2Rpdj5gXHJcbiAgICAgICAgY2hhdEFyZWEuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsZWxtKVxyXG4gICAgICAgIGlucHV0LnZhbHVlID0gXCJcIlxyXG4gICAgICAgIGlmIChtZXNzYWdlLnRvTG93ZXJDYXNlKCkgPT0gXCJwcm90b2NvbG9cIikge1xyXG4gICAgICAgICAgICByZXRQcm90byA9IHRydWVcclxuICAgICAgICAgICAgZWxtID0gYDxkaXYgY2xhc3M9XCJpbmNvbWUtbXNnXCI+PHNwYW4gY2xhc3M9XCJtc2dcIj5Qb3IgZmF2b3IsIGluZm9ybWUgbyBuw7ptZXJvIGRvIHByb3RvY29sbyBxdWUgdm9jw6ogZGVzZWphIGFjb21wYW5oYXIuPC9zcGFuPjwvZGl2PmBcclxuICAgICAgICAgICAgY2hhdEFyZWEuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsZWxtKVxyXG4gICAgICAgICAgICBoaXN0ID0gaGlzdCArIGBQb3IgZmF2b3IsIGluZm9ybWUgbyBuw7ptZXJvIGRvIHByb3RvY29sbyBxdWUgdm9jw6ogZGVzZWphIGFjb21wYW5oYXIuYCArIFwiXFxuXCJcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXRQcm90bykge1xyXG4gICAgICAgICAgICBsZXQgdGlja2V0Q29udGVudDpSVGlja2V0ID0ge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBcInJcIixcclxuICAgICAgICAgICAgICAgIHByb3RvOiBtZXNzYWdlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHE6Qm90UmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IHRpY2tldENvbnRlbnRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcmVzcCA9IGF3YWl0IEFQSS50aWNrZXQocSwgYXV0aEtleSlcclxuICAgICAgICAgICAgaWYgKHJlc3AucmVzcCA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGA8ZGl2IGNsYXNzPVwiaW5jb21lLW1zZ1wiPjxzcGFuIGNsYXNzPVwibXNnXCI+RGVzY3VscGUsIG1hcyBuw6NvIGNvbnNlZ3VpbW9zIGVuY29udHJhciBubyBub3NzbyBiYW5jbyBkZSBkYWRvcyBvIHByb3RvY29sbyBpbmZvcm1hZG8uIENhc28gcXVlaXJhIHRlbnRhciBub3ZhbWVudGUsIGRpZ2l0ZSBcIlByb3RvY29sb1wiIGUgYXNzZWd1cmUtc2UgZGUgcXVlIGRpZ2l0b3Ugb3MgbsO6bWVyb3MgY29ycmV0YW1lbnRlLiBDYXNvIHF1ZWlyYSBhYnJpciB1bSBjaGFtYWRvLCBiYXN0YSBwcmVzc2lvbmFyIG8gc8OtbWJvbG8gZGUgZW52ZWxvcGUgYW8gbGFkbyBkbyBib3TDo28gZGUgZW52aW8gZGUgbWVuc2FnZW5zIGUgcHJlZW5jaGVyIG8gZm9ybXVsw6FyaW8uPC9zcGFuPjwvZGl2PmBcclxuICAgICAgICAgICAgICAgIGNoYXRBcmVhLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLGVsbSlcclxuICAgICAgICAgICAgICAgIGhpc3QgPSBoaXN0ICsgYERlc2N1bHBlLCBtYXMgbsOjbyBjb25zZWd1aW1vcyBlbmNvbnRyYXIgbm8gbm9zc28gYmFuY28gZGUgZGFkb3MgbyBwcm90b2NvbG8gaW5mb3JtYWRvLiBDYXNvIHF1ZWlyYSB0ZW50YXIgbm92YW1lbnRlLCBkaWdpdGUgXCJQcm90b2NvbG9cIiBlIGFzc2VndXJlLXNlIGRlIHF1ZSBkaWdpdG91IG9zIG7Dum1lcm9zIGNvcnJldGFtZW50ZS4gQ2FzbyBxdWVpcmEgYWJyaXIgdW0gY2hhbWFkbywgYmFzdGEgcHJlc3Npb25hciBvIHPDrW1ib2xvIGRlIGVudmVsb3BlIGFvIGxhZG8gZG8gYm90w6NvIGRlIGVudmlvIGRlIG1lbnNhZ2VucyBlIHByZWVuY2hlciBvIGZvcm11bMOhcmlvLmAgKyBcIlxcblwiXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcC5zdGF0dXMgPT0gXCJPXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwLnN0YXR1cyA9IFwiQWJlcnRvXCJcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcC5zdGF0dXMgPT0gXCJDXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwLnN0YXR1cyA9IFwiRmVjaGFkb1wiXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3Auc3RhdHVzID09IFwiUFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcC5zdGF0dXMgPSBcIkVtIHByb2Nlc3NhbWVudG9cIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3AucmVzcCA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcC5yZXNwID0gXCJTZXUgY2hhbWFkbyBhaW5kYSBuw6NvIGNvbWXDp291IGEgc2VyIHByb2Nlc3NhZG8gcG9yIG5lbmh1bSBkZSBub3Nzb3Mgb3BlcmFkb3Jlcy4gU29saWNpdGFtb3MgcXVlIGFndWFyZGUgbWFpcyB1bSBwb3VjbyBlIGFncmFkZcOnZW1vcyBhIHN1YSBwYWNpw6puY2lhLlwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBgPGRpdiBjbGFzcz1cImluY29tZS1tc2dcIj48c3BhbiBjbGFzcz1cIm1zZ1wiPk8gc3RhdHVzIGRvIHNldSBjaGFtYWRvIGRlIG7Dum1lcm8gJHttZXNzYWdlfSDDqTogJHtyZXNwLnN0YXR1c30uPC9zcGFuPjwvZGl2PmBcclxuICAgICAgICAgICAgICAgIGNoYXRBcmVhLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLGVsbSlcclxuICAgICAgICAgICAgICAgIGhpc3QgPSBoaXN0ICsgYE8gc3RhdHVzIGRvIHNldSBjaGFtYWRvIGRlIG7Dum1lcm8gJHttZXNzYWdlfSDDqTogJHtyZXNwLnN0YXR1c30uXFxuJHtyZXNwLnJlc3B9YCArIFwiXFxuXCJcclxuICAgICAgICAgICAgICAgIGVsbSA9IGA8ZGl2IGNsYXNzPVwiaW5jb21lLW1zZ1wiPjxzcGFuIGNsYXNzPVwibXNnXCIgc3R5bGU9XCJ3aGl0ZS1zcGFjZTogcHJlLWxpbmVcIj4ke3Jlc3AucmVzcH08L3NwYW4+PC9kaXY+YFxyXG4gICAgICAgICAgICAgICAgY2hhdEFyZWEuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsZWxtKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldFByb3RvID0gZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IHE6Qm90UmVxdWVzdD17XHJcbiAgICAgICAgZGF0YToge1F1ZXN0aW9uOm1lc3NhZ2UsIGludHJvOnN0YXJ0ZXJGbGFnLCB0aWNrZXQ6dGlja2V0RmxhZywgYWxpYXM6Ym90LkFsaWFzfVxyXG4gICAgfVxyXG4gICAgbGV0IHJlc3BvbnNlcyA9IGF3YWl0IEFQSS50ZXN0UShxLGF1dGhLZXkpXHJcbiAgICBpZiAoIXRpY2tldEZsYWcpIHsgICAgXHJcbiAgICAgICAgZm9yIChsZXQgciBvZiByZXNwb25zZXMuZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoci5pbmNsdWRlcyhcInxRfFwiKSl7XHJcbiAgICAgICAgICAgICAgICByID0gci5zbGljZSgwLC0zKVxyXG4gICAgICAgICAgICAgICAgZWxtID0gYDxkaXYgY2xhc3M9XCJpbnRlcmFjdGl2ZS1xdWVzdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJpbnRlcmFjdGl2ZVwiIG9uY2xpY2s9XCJ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWVzdGlvbicpLnZhbHVlID0gdGhpcy5pbm5lclRleHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbmQtbWVzc2FnZScpLmNsaWNrKClcclxuICAgICAgICAgICAgICAgICAgICB9XCI+PGI+JHtyfTwvYj48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBgPGRpdiBjbGFzcz1cImluY29tZS1tc2dcIj48c3BhbiBjbGFzcz1cIm1zZ1wiPiR7cn08L3NwYW4+PC9kaXY+YFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGhpc3QgPSBoaXN0K3IrXCJcXG5cIlxyXG4gICAgICAgICAgICBjaGF0QXJlYS5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIixlbG0pXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBlbG0gPSBgPGRpdiBjbGFzcz1cInRpY2tldC1mb3JtXCI+YCArIHJlc3BvbnNlcy5kYXRhWzBdK2A8dGV4dGFyZWEgaWQ9XCJyZWFzb25cIiBwbGFjZWhvbGRlcj1cIkluc2lyYSBhIHJhesOjbyBkbyBjb250YXRvXCIgY2xhc3M9XCJ0ZXh0YXJlYXNcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1idG5cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJmb3JtLW9wZXJhdG9yc1wiIGlkPVwiZm9ybS1jYW5jZWxcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMjBweDtcIj5DQU5DRUxBUjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImZvcm0tb3BlcmF0b3JzXCIgaWQ9XCJmb3JtLXNlbmRcIiBzdHlsZT1cIm1hcmdpbi1sZWZ0OiAyMHB4O1wiPkNPTkZJUk1BUjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmBcclxuICAgICAgICBjaGF0QXJlYS5pbm5lckhUTUwgPSBlbG1cclxuICAgICAgICBjaGF0QXJlYS5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIlxyXG4gICAgICAgIGxldCBmb3JtU2VuZDpIVE1MQnV0dG9uRWxlbWVudCA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcm0tc2VuZFwiKVxyXG4gICAgICAgIGxldCBmb3JtQ2FuY2VsOkhUTUxCdXR0b25FbGVtZW50ID0gPEhUTUxCdXR0b25FbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9ybS1jYW5jZWxcIilcclxuICAgICAgICBmb3JtU2VuZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsYXN5bmMgKCk9PntcclxuICAgICAgICAgICAgbGV0IGZvcm1MaXN0ID0gPEhUTUxDb2xsZWN0aW9uT2Y8SFRNTElucHV0RWxlbWVudD4+ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIi5pbnB1dHNcIilcclxuICAgICAgICAgICAgbGV0IHJlYXNvbiA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVhc29uXCIpXHJcbiAgICAgICAgICAgIGxldCBjaW5mbyA9IFwiXCJcclxuICAgICAgICAgICAgZm9yIChsZXQgZiBvZiBmb3JtTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgY2luZm8gPSBjaW5mbyArIGYudmFsdWUgKyBcIi8mL1wiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2luZm8gPSBjaW5mbyArIC8mLyArIHJlYXNvbi52YWx1ZVxyXG4gICAgICAgICAgICBsZXQgdGlja2V0Q29udGVudDpPVGlja2V0ID0ge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBcImNcIixcclxuICAgICAgICAgICAgICAgIGluZm86IHtcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IFwidGVzdGUxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhdDogaGlzdCxcclxuICAgICAgICAgICAgICAgICAgICBjaW5mbzogY2luZm8sXHJcbiAgICAgICAgICAgICAgICAgICAgYWxpYXM6IGJvdC5BbGlhc1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBxOkJvdFJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhOiB0aWNrZXRDb250ZW50XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHJlc3AgPSBhd2FpdCBBUEkudGlja2V0KHEsIGF1dGhLZXkpXHJcbiAgICAgICAgICAgIGVsbSA9IGA8ZGl2IGNsYXNzPVwiaW5jb21lLW1zZ1wiPjxzcGFuIGNsYXNzPVwibXNnXCI+QWdyYWRlY2Vtb3MgbyBjb250YXRvLiBPIHNldSBjaGFtYWRvIGZvaSBhYmVydG8gZSBzZXLDoSBhbmFsaXNhZG8gZW0gYnJldmUgcG9yIHVtIGRlIG5vc3NvcyBvcGVyYWRvcmVzLiBTZXUgcHJvdG9jb2xvIMOpOiAke3Jlc3AucHJvdG99LiBDYXNvIHF1ZWlyYSBhY29tcGFuaGFyIG8gYW5kYW1lbnRvIGRvIHNldSBjaGFtYWRvLCBiYXN0YSBkaWdpdGFyIFwiUHJvdG9jb2xvXCIgZSBmb3JuZWNlciBlc3NlIG7Dum1lcm8gcXVhbmRvIHNvbGljaXRhZG8uPC9zcGFuPjwvZGl2PmBcclxuICAgICAgICAgICAgY2hhdEFyZWEuaW5uZXJIVE1MID0gXCJcIlxyXG4gICAgICAgICAgICBjaGF0QXJlYS5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIixlbG0pXHJcbiAgICAgICAgICAgIGhpc3QgPSBcIkVtIHF1ZSBtYWlzIGV1IHBvc3NvIGFqdWRhcj9cXG5cIlxyXG4gICAgICAgICAgICBlbG0gPSBgPGRpdiBjbGFzcz1cImluY29tZS1tc2dcIj48c3BhbiBjbGFzcz1cIm1zZ1wiPkVtIHF1ZSBtYWlzIGV1IHBvc3NvIGFqdWRhcj88L3NwYW4+PC9kaXY+YFxyXG4gICAgICAgICAgICBjaGF0QXJlYS5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIixlbG0pXHJcbiAgICAgICAgICAgIHRpY2tldEZsYWcgPSBmYWxzZVxyXG4gICAgICAgICAgICBpbkFyZWEuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiXHJcbiAgICAgICAgICAgIGNoYXRBcmVhLnN0eWxlLmhlaWdodCA9IFwiOTAlXCJcclxuICAgICAgICB9KVxyXG4gICAgICAgIGZvcm1DYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGFzeW5jICgpPT57XHJcbiAgICAgICAgICAgIGVsbSA9IGA8ZGl2IGNsYXNzPVwiaW5jb21lLW1zZ1wiPjxzcGFuIGNsYXNzPVwibXNnXCI+QSBhYmVydHVyYSBkZSBjaGFtYWRvIGZvaSBjYW5jZWxhZGEuIEVtIHF1ZSBtYWlzIGV1IHBvc3NvIHRlIGFqdWRhcj88L3NwYW4+PC9kaXY+YFxyXG4gICAgICAgICAgICBjaGF0QXJlYS5pbm5lckhUTUwgPSBcIlwiXHJcbiAgICAgICAgICAgIGNoYXRBcmVhLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLGVsbSlcclxuICAgICAgICAgICAgaGlzdCA9IGhpc3QgKyBcIkEgYWJlcnR1cmEgZGUgY2hhbWFkbyBmb2kgY2FuY2VsYWRhLiBFbSBxdWUgbWFpcyBldSBwb3NzbyB0ZSBhanVkYXI/XFxuXCJcclxuICAgICAgICAgICAgdGlja2V0RmxhZyA9IGZhbHNlXHJcbiAgICAgICAgICAgIGluQXJlYS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCJcclxuICAgICAgICAgICAgY2hhdEFyZWEuc3R5bGUuaGVpZ2h0ID0gXCI5MCVcIlxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBjaGF0QXJlYS5zY3JvbGxUb3AgPSBjaGF0QXJlYS5zY3JvbGxIZWlnaHRcclxufVxyXG5cclxudGlja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKT0+IHtcclxuICAgIGluQXJlYS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCIgXHJcbiAgICB0aWNrZXRGbGFnID0gdHJ1ZVxyXG4gICAgdGVzdFEoKVxyXG59KVxyXG4iXX0=