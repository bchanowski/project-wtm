import Skeleton from "react-loading-skeleton";
import Table from "react-bootstrap/Table";

import React from "react";
export function RemoteDaysSkeleton({}) {
  return (
    <Table>
      <thead>
        <tr>
          <th>
            <Skeleton />
          </th>
          <th>
            <Skeleton />
          </th>
          <th>
            <Skeleton />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
        </tr>
        <tr>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
        </tr>
        <tr>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
