import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? "lightgreen" : "white")};
  border-radius: 5px;
  height: 80px;
  font-size: ${props => props.fontSize};
`;

const Task = props => {
  return (
    <Draggable draggableId={props.task.id} index={props.taskIndex}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          fontSize={props.fontSize}
        >
          {props.display}
        </Container>
      )}
    </Draggable>
  );
};

Task.propTypes = {
  taskIndex: PropTypes.string.isRequired,
  task: PropTypes.object.isRequired,
  fontSize: PropTypes.string.isRequired,
  display: PropTypes.string.isRequired
};

export default Task;
