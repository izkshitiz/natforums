import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { castPointAction } from "../../../../store/actions/Threads";

export const Point = (props) => {
  const { compact, threadId, charge, userpoints } = props;
  let negativePointsColor, positivePointsColor;

  if (userpoints < 0) {
    negativePointsColor = "red";
  }

  if (userpoints > 0) {
    positivePointsColor = "red";
  }

  const token = useSelector(state => state.Auth.token);
  const weightage = useSelector(state => state.Auth.weightage);
  const requestPending = useSelector(state => state.Threads.castPointRequestPending);
  const dispatch = useDispatch();

  return (
    charge === "positive" ?
      <span
        style={{ color: positivePointsColor, cursor: "pointer" }}
        onClick={() => { dispatch(castPointAction(compact, token, threadId, charge)) }} >
        <PlusOutlined style={{ fontSize: '14px' }} spin={requestPending === "positive"+threadId} />{weightage}
      </span> :
      <span
        style={{ color: negativePointsColor, cursor: "pointer" }}
        onClick={() => dispatch(castPointAction(compact, token, threadId, charge))}  >
        <MinusOutlined style={{ fontSize: '14px' }} spin={requestPending === "negative"+threadId} />
        {weightage}
      </span>
  );
};