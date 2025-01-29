interface Credentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  username: string;
}

export const useAuth = () => {
  const token = useCookie("token");
  const user = useState<User | null>("user", () => null);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await $fetch<{ token: string; user: User }>(
        "/api/login",
        {
          method: "POST",
          body: credentials,
        }
      );

      if (response.token) {
        token.value = response.token;
        user.value = response.user;
        await navigateTo("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    token.value = null;
    user.value = null;
    await navigateTo("/login");
  };

  return {
    token,
    user,
    login,
    logout,
  };
};
