export const convertDate = (date) => {
  const shiftDate = new Date(date);

  const day = String(shiftDate.getDate()).padStart(2, 0);
  const month = String(shiftDate.getMonth() + 1).padStart(2, 0);
  const year = shiftDate.getFullYear();
  const hour = String(shiftDate.getHours()).padStart(2, 0);
  const minute = String(shiftDate.getMinutes()).padStart(2, 0);

  return [year, month, day, hour, minute];
};
