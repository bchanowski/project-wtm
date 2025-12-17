import { useContext, useEffect, useState } from "react";
import AppContext from "../../shared/context/app-context";
import useHttp from "../../shared/useHttp";
import FilterDatesForm from "./forms/FilterDatesForm";

import classes from "./UserAccountView.module.css";

const FilterDataController = ({
  userId,
  setData,
  endPoint,
  lastFilteredDay,
}) => {
  const [formData, setFormData] = useState(null);
  const [filterMsg, setFilterMsg] = useState(null);

  const { token } = useContext(AppContext);

  const { requestStatus, requestError, sendRequest, resetHookState } =
    useHttp();

  const getDates = async () => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_API_URL + `/api/${endPoint}`,
        {
          method: "POST",
          body: JSON.stringify({
            dateStart: formData.start,
            dateEnd: formData.end,
            id: userId,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!responseData) throw "";

      setFormData(null);
      if (!!responseData.data.length) {
        setData(responseData.data);
      } else {
        setFilterMsg("Brak wyników dla wybranego zakresu");
      }
    } catch (err) {
      setFormData(null);
    }
  };

  useEffect(() => {
    if (!formData) return;
    getDates();
  }, [formData]);

  useEffect(() => {
    if (!filterMsg) return;
    setTimeout(() => setFilterMsg(null), 900);
  }, [filterMsg]);

  useEffect(() => {
    if (!requestError) return;
    setTimeout(() => resetHookState(), 900);
  }, [requestError]);

  return (
    <div className={classes["filterForm-wrapper"]}>
      <FilterDatesForm
        setFormData={setFormData}
        requestStatus={requestStatus}
        lastFilteredDay={lastFilteredDay}
      />
      <div className={`${classes["no-results-remoteDays-filter"]}`}>
        {!!filterMsg && <p>{filterMsg}</p>}
        {!!requestError && <p className="text-danger">{requestError}</p>}
      </div>
    </div>
  );
};

export default FilterDataController;
