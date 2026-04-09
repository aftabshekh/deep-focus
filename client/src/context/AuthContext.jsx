import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('accessToken');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ✅ FIXED — register ke baad login nahi hoga, sirf message return karega
  const register = useCallback(async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    // accessToken ya user set NAHI karo — email verify hone ke baad login hoga
    return res.data;
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // silently ignore
    }
    localStorage.removeItem('accessToken');
    setUser(null);
  }, []);

  const enrollCourse = useCallback(async (courseId) => {
    const res = await api.post(`/courses/enroll/${courseId}`);
    return res.data;
  }, []);

  const getMyCourses = useCallback(async () => {
    const res = await api.get('/courses/my');
    return res.data;
  }, []);

  const updateCourseProgress = useCallback(async (courseId, progress) => {
    const res = await api.put(`/courses/progress/${courseId}`, { progress });
    return res.data;
  }, []);

  const startBook = useCallback(async (bookId) => {
    const res = await api.post(`/books/start/${bookId}`);
    return res.data;
  }, []);

  const getMyBooks = useCallback(async () => {
    const res = await api.get('/books/my');
    return res.data;
  }, []);

  const updateBookProgress = useCallback(async (bookId, currentChapter) => {
    const res = await api.put(`/books/progress/${bookId}`, { currentChapter });
    return res.data;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      register,
      login,
      logout,
      enrollCourse,
      getMyCourses,
      updateCourseProgress,
      startBook,
      getMyBooks,
      updateBookProgress,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);