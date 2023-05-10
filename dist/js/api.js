export let EndPoint = "https://salus.vdsip.com.br/";
export function setEndPoint(s) {
    EndPoint = s;
}
function notAuthorized() {
    alert("Sorry, the bot is disabled. We're trying to solve this problem");
}
async function invoke(method, path, data, auth) {
    // Default options are marked with *
    let init = {
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    };
    if (method != "GET" && method != "HEAD") {
        init.body = JSON.stringify(data);
    }
    const response = await fetch(EndPoint + path, init);
    if (response.status == 403 || response.status == 401) {
        notAuthorized();
        return;
    }
    let txt = await response.text();
    return JSON.parse(txt);
}
class api {
    //Returns the auth token
    async login(bot) {
        return await invoke("POST", "bot/v1/login", bot, '');
    }
    //Returns a list of strings
    async testQ(question, token) {
        return await invoke("POST", "bot/v1/testQ", question, token);
    }
    //Returns the protocol number (string) or the updates of the protocol (RTicket)
    async ticket(ticket, token) {
        return await invoke("POST", "bot/v1/protocol", ticket, token);
    }
}
export let API = new api();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxJQUFJLFFBQVEsR0FBVyw2QkFBNkIsQ0FBQTtBQUUzRCxNQUFNLFVBQVUsV0FBVyxDQUFDLENBQVM7SUFDakMsUUFBUSxHQUFHLENBQUMsQ0FBQTtBQUNoQixDQUFDO0FBRUQsU0FBUyxhQUFhO0lBQ2xCLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFBO0FBQzNFLENBQUM7QUFFRCxLQUFLLFVBQVUsTUFBTSxDQUFDLE1BQWtELEVBQUUsSUFBWSxFQUFFLElBQVMsRUFBRyxJQUFZO0lBQzVHLG9DQUFvQztJQUNwQyxJQUFJLElBQUksR0FBZ0I7UUFDcEIsTUFBTSxFQUFFLE1BQU07UUFDZCxJQUFJLEVBQUUsTUFBTTtRQUNaLEtBQUssRUFBRSxVQUFVO1FBQ2pCLFdBQVcsRUFBRSxhQUFhO1FBQzFCLE9BQU8sRUFBRTtZQUNMLGNBQWMsRUFBRSxrQkFBa0I7WUFDbEMsZUFBZSxFQUFFLElBQUk7U0FDeEI7UUFDRCxRQUFRLEVBQUUsUUFBUTtRQUNsQixjQUFjLEVBQUUsYUFBYTtRQUM3QixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxrREFBa0Q7S0FDaEYsQ0FBQTtJQUNELElBQUksTUFBTSxJQUFJLEtBQUssSUFBSSxNQUFNLElBQUksTUFBTSxFQUFFO1FBQ3JDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNuQztJQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFcEQsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRztRQUNuRCxhQUFhLEVBQUUsQ0FBQTtRQUNmLE9BQU07S0FDVDtJQUVELElBQUksR0FBRyxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFBO0lBRy9CLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBaURELE1BQU0sR0FBRztJQUVMLHdCQUF3QjtJQUN4QixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQVE7UUFDaEIsT0FBTyxNQUFNLE1BQU0sQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUN4RCxDQUFDO0lBRUQsMkJBQTJCO0lBQzNCLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBb0IsRUFBRSxLQUFhO1FBQzNDLE9BQU8sTUFBTSxNQUFNLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDaEUsQ0FBQztJQUVELCtFQUErRTtJQUMvRSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQWtCLEVBQUUsS0FBYTtRQUMxQyxPQUFPLE1BQU0sTUFBTSxDQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDakUsQ0FBQztDQUVKO0FBRUQsTUFBTSxDQUFDLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgbGV0IEVuZFBvaW50OiBzdHJpbmcgPSBcImh0dHBzOi8vc2FsdXMudmRzaXAuY29tLmJyL1wiXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0RW5kUG9pbnQoczogc3RyaW5nKSB7XHJcbiAgICBFbmRQb2ludCA9IHNcclxufVxyXG5cclxuZnVuY3Rpb24gbm90QXV0aG9yaXplZCgpIHtcclxuICAgIGFsZXJ0KFwiU29ycnksIHRoZSBib3QgaXMgZGlzYWJsZWQuIFdlJ3JlIHRyeWluZyB0byBzb2x2ZSB0aGlzIHByb2JsZW1cIilcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gaW52b2tlKG1ldGhvZDogXCJIRUFEXCIgfCBcIkdFVFwiIHwgXCJQT1NUXCIgfCBcIlBVVFwiIHwgXCJERUxFVEVcIiwgcGF0aDogc3RyaW5nLCBkYXRhOiBhbnksICBhdXRoOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgLy8gRGVmYXVsdCBvcHRpb25zIGFyZSBtYXJrZWQgd2l0aCAqXHJcbiAgICBsZXQgaW5pdDogUmVxdWVzdEluaXQgPSB7XHJcbiAgICAgICAgbWV0aG9kOiBtZXRob2QsIC8vICpHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBldGMuXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLCAvLyBuby1jb3JzLCAqY29ycywgc2FtZS1vcmlnaW5cclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJywgLy8gKmRlZmF1bHQsIG5vLWNhY2hlLCByZWxvYWQsIGZvcmNlLWNhY2hlLCBvbmx5LWlmLWNhY2hlZFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLCAvLyBpbmNsdWRlLCAqc2FtZS1vcmlnaW4sIG9taXRcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogYXV0aFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVkaXJlY3Q6ICdmb2xsb3cnLCAvLyBtYW51YWwsICpmb2xsb3csIGVycm9yXHJcbiAgICAgICAgcmVmZXJyZXJQb2xpY3k6ICduby1yZWZlcnJlcicsIC8vIG5vLXJlZmVycmVyLCAqbm8tcmVmZXJyZXItd2hlbi1kb3duZ3JhZGUsIG9yaWdpbiwgb3JpZ2luLXdoZW4tY3Jvc3Mtb3JpZ2luLCBzYW1lLW9yaWdpbiwgc3RyaWN0LW9yaWdpbiwgc3RyaWN0LW9yaWdpbi13aGVuLWNyb3NzLW9yaWdpbiwgdW5zYWZlLXVybFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpIC8vIGJvZHkgZGF0YSB0eXBlIG11c3QgbWF0Y2ggXCJDb250ZW50LVR5cGVcIiBoZWFkZXJcclxuICAgIH1cclxuICAgIGlmIChtZXRob2QgIT0gXCJHRVRcIiAmJiBtZXRob2QgIT0gXCJIRUFEXCIpIHtcclxuICAgICAgICBpbml0LmJvZHkgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChFbmRQb2ludCArIHBhdGgsIGluaXQpO1xyXG5cclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNDAzIHx8IHJlc3BvbnNlLnN0YXR1cyA9PSA0MDEgKSB7XHJcbiAgICAgICAgbm90QXV0aG9yaXplZCgpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHR4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG5cclxuXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh0eHQpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBCb3Qge1xyXG4gICAgQWxpYXM6IHN0cmluZ1xyXG4gICAgUGFzc2NvZGU6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEJvdFJlcXVlc3Qge1xyXG4gICAgZGF0YTogYW55XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUXVlc3Rpb24ge1xyXG4gICAgUXVlc3Rpb246IHN0cmluZ1xyXG4gICAgaW50cm86IGJvb2xlYW5cclxuICAgIHRpY2tldDogYm9vbGVhblxyXG4gICAgYWxpYXM6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE9UaWNrZXQge1xyXG4gICAgdGFyZ2V0OiBzdHJpbmdcclxuICAgIGluZm86IFRpY2tldFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRpY2tldCB7XHJcbiAgICBvcmlnaW46IHN0cmluZ1xyXG4gICAgY2hhdDogc3RyaW5nXHJcbiAgICBjaW5mbzogc3RyaW5nXHJcbiAgICBhbGlhczogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUlRpY2tldCB7XHJcbiAgICB0YXJnZXQ6IHN0cmluZ1xyXG4gICAgcHJvdG86IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlc3BvbnNlIHtcclxuICAgIGRhdGE6IHN0cmluZ1tdXHJcbiAgICB0b2tlbjogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUHJvdG9jb2xSZXNwb25zZSB7XHJcbiAgICBwcm90bzogc3RyaW5nXHJcbiAgICByZXNwOiBzdHJpbmdcclxuICAgIHN0YXR1czogc3RyaW5nXHJcbn1cclxuXHJcblxyXG5cclxuY2xhc3MgYXBpIHtcclxuXHJcbiAgICAvL1JldHVybnMgdGhlIGF1dGggdG9rZW5cclxuICAgIGFzeW5jIGxvZ2luKGJvdDogQm90KTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCBpbnZva2UoXCJQT1NUXCIsIFwiYm90L3YxL2xvZ2luXCIsIGJvdCwgJycpXHJcbiAgICB9XHJcblxyXG4gICAgLy9SZXR1cm5zIGEgbGlzdCBvZiBzdHJpbmdzXHJcbiAgICBhc3luYyB0ZXN0UShxdWVzdGlvbjogQm90UmVxdWVzdCwgdG9rZW46IHN0cmluZyk6IFByb21pc2U8UmVzcG9uc2U+IHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgaW52b2tlKFwiUE9TVFwiLCBcImJvdC92MS90ZXN0UVwiLCBxdWVzdGlvbiwgdG9rZW4pXHJcbiAgICB9XHJcblxyXG4gICAgLy9SZXR1cm5zIHRoZSBwcm90b2NvbCBudW1iZXIgKHN0cmluZykgb3IgdGhlIHVwZGF0ZXMgb2YgdGhlIHByb3RvY29sIChSVGlja2V0KVxyXG4gICAgYXN5bmMgdGlja2V0KHRpY2tldDogQm90UmVxdWVzdCwgdG9rZW46IHN0cmluZyk6IFByb21pc2U8UHJvdG9jb2xSZXNwb25zZT4ge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCBpbnZva2UoXCJQT1NUXCIsIFwiYm90L3YxL3Byb3RvY29sXCIsIHRpY2tldCwgdG9rZW4pXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgbGV0IEFQSSA9IG5ldyBhcGkoKSJdfQ==