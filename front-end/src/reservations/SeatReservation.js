import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, seatReservation } from "../utils/api";

export default function SeatReservation({ tables, setTables, loadDashboard }) {
  const history = useHistory();
  const { reservation_id } = useParams();

  const initialState = { table_id: 0 };
  const [formData, setFormData] = useState(initialState);
  const [reservation, setReservation] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    Promise.all([
      readReservation(reservation_id, abortController.signal).then(setReservation),
      listTables(abortController.signal).then(setTables),
    ])
      .catch(setError)
      .finally(() => setIsLoading(false));

    return () => abortController.abort();
  }, [reservation_id, setTables]);

  const { first_name = "", last_name = "", people = "" } = reservation || {};

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!tables.length) {
      setError({ message: "No tables available" });
      return;
    }

    const abortController = new AbortController();
    if (formData.table_id > 0) {
      seatReservation(reservation_id, formData.table_id, abortController.signal)
        .then(() => {
          alert("Reservation seated successfully!");
          history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch(setError);
    } else {
      setError({ message: "Not a valid table" });
    }
    return () => abortController.abort();
  };

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const tableOptionsJSX = () => {
    return tables.map((table) => (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    ));
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="row justify-content-center">
      <form className="col-lg-10" onSubmit={handleSubmit}>
        <h1 className="text-center py-4">Seat Reservation</h1>
        <ErrorAlert error={error} />
        <h3 className="text-center py-2">{`${first_name} ${last_name} | Party of ${people}`}</h3>
        <label className="form-label" htmlFor="table_id">
          Choose Table:
        </label>
        <select
          className="form-control"
          name="table_id"
          id="table_id"
          onChange={handleChange}
          value={formData.table_id}
        >
          <option value={0} disabled>
            Choose a table
          </option>
          {tableOptionsJSX()}
        </select>
        <div className="form-group">
          <button className="btn btn-xs btn-dark btn-outline-light my-4 w-10" type="submit">
            Submit
          </button>
          <button
            className="btn btn-xs btn-cancel text-dark btn-outline-light my-4 mx-2 w-10"
            type="button"
            onClick={history.goBack}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
