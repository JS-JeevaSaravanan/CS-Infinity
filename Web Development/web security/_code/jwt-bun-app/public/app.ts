type AuthResponse = {
  message: string;
};

const loginForm = document.getElementById(
  "loginForm",
) as HTMLFormElement | null;
const registerForm = document.getElementById(
  "registerForm",
) as HTMLFormElement | null;
const messageEl = document.getElementById(
  "message",
) as HTMLParagraphElement | null;

async function postJSON<T>(url: string, data: object): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    const data = await postJSON<AuthResponse>("/api/login", {
      email,
      password,
    });

    if (messageEl) messageEl.innerText = data.message;
  });
}

// REGISTER
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    const data = await postJSON<AuthResponse>("/api/register", {
      email,
      password,
    });

    if (messageEl) messageEl.innerText = data.message;
  });
}
