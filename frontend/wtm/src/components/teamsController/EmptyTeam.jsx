import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Backdrop from "./Backdrop";

function EmptyTeam(props) {
  return (
    <Card
      className="text-center"
      style={{ height: "100px" }}
      bg={"dark"}
      text={"light"}
    >
      <Card.Body style={{ fontSize: "45px" }}> Zespół jest pusty. </Card.Body>
    </Card>
  );
}
export default EmptyTeam;
