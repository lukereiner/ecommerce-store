export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};
