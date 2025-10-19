import renderAdminLogin from "./screens/admin-login.js";
import renderAdminSignup from "./screens/admin-signup.js";
import renderDashboard from "./screens/dashboard.js";
import renderProductsManage from "./screens/products-manage.js";
import renderAddDog from "./screens/add-dog.js";
import renderAppointmentsManage from "./screens/appointments-manage.js";
import renderDonationsView from "./screens/donations-view.js";
import renderDonationsProfileDog from "./screens/donations-profile-dog.js";
import renderDogEstadistics from "./screens/dog-estadistics.js";

const socket = io("/", { path: "/real-time" });

function clearScripts() {
  document.getElementById("app").innerHTML = "";
}

let route = { path: "/admin-login", data: {} };

// Función para renderizar la pantalla actual
async function renderCurrentScreen() {
  clearScripts();
  
  switch (route.path) {
    case "/admin-login":
      renderAdminLogin(route.data);
      break;
    case "/admin-signup":
      renderAdminSignup(route.data);
      break;
    case "/dashboard":
      await renderDashboard(route.data);
      break;
    case "/products-manage":
      await renderProductsManage(route.data);
      break;
    case "/add-pet":
      await renderAddDog(route.data);
      break;
    case "/appointments":
      await renderAppointmentsManage(route.data);
      break;
    case "/donations":
      await renderDonationsView(route.data);
      break;
    case "/donations-profile-dog":
      await renderDonationsProfileDog(route.data);
      break;
    case "/dog-estadistics":
      await renderDogEstadistics(route.data);
      break;
    default:
      const app = document.getElementById("app");
      app.innerHTML = `<h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p>`;
  }
}

// Renderizar la pantalla inicial
renderCurrentScreen();

function navigateTo(path, data) {
  route = { path, data };
  renderCurrentScreen();
}

async function makeRequest(url, method, body) {
  const BASE_URL = "http://localhost:5050";
  let response = await fetch(`${BASE_URL}${url}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  response = await response.json();

  return response;
}

export { navigateTo, socket, makeRequest };