import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load — restore session if token exists
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

  const register = useCallback(async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
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
      // silently ignore if server is unreachable
    }
    localStorage.removeItem('accessToken');
    setUser(null);
  }, []);

  // Enroll in a course — saves to MongoDB
  const enrollCourse = useCallback(async (courseId) => {
    const res = await api.post(`/courses/enroll/${courseId}`);
    return res.data;
  }, []);

  // Get enrolled courses from DB
  const getMyCourses = useCallback(async () => {
    const res = await api.get('/courses/my');
    return res.data;
  }, []);

  // Update course progress
  const updateCourseProgress = useCallback(async (courseId, progress) => {
    const res = await api.put(`/courses/progress/${courseId}`, { progress });
    return res.data;
  }, []);

  // Start reading a book — saves to MongoDB
  const startBook = useCallback(async (bookId) => {
    const res = await api.post(`/books/start/${bookId}`);
    return res.data;
  }, []);

  // Get my books from DB
  const getMyBooks = useCallback(async () => {
    const res = await api.get('/books/my');
    return res.data;
  }, []);

  // Update book reading progress
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
