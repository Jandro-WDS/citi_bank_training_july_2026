
const API_URL = "http://localhost:3000/api/users";

// Login function
export async function login(email: String, password : String) {
  try{

    const response  = await fetch(`${API_URL}/signin`, {
      method: "post",
      headers: {"content-type" : "application/json"},
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();
    return data;
  }
  catch(error){
    console.error("Login error:", error);
    return { error: "Network or server error" };
  }
}

// Signup function
export async function signup(
  name: String,
  email: String,
  password: String,
  age: Number,
  weight: Number,
  height: Number,
  weightGoal: Number
) {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        age,
        weight,
        height,
        weightGoal,
      }),
    });

    const data = await response.json();
    return data; // contains message, user info, or errors
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Network or server error" };
  }
}