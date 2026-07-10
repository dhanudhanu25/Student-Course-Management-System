import useLocalStorage from './useLocalStorage';

const MAX_RECENT = 5;

const useRecentlyViewed = () => {
  const [recentCourses, setRecentCourses] = useLocalStorage('recentlyViewed', []);

  const addRecentCourse = (course) => {
    if (!course?._id) return;
    setRecentCourses((prev) => {
      const filtered = prev.filter((c) => c._id !== course._id);
      const updated = [
        {
          _id: course._id,
          title: course.title,
          thumbnail: course.thumbnail,
          category: course.category,
          price: course.price,
        },
        ...filtered,
      ].slice(0, MAX_RECENT);
      return updated;
    });
  };

  const clearRecent = () => setRecentCourses([]);

  return { recentCourses, addRecentCourse, clearRecent };
};

export default useRecentlyViewed;
