import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Droppable } from "react-beautiful-dnd";
import Task from "../common/task";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 300px;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
  background-color: ${props =>
    props.checkedInTitle ? "rgb(59, 88, 99)" : "rgb(135, 180, 197)"};
  color: #fff;
  font-weight: 400;
`;
const TaskList = styled.div`
  padding: 8px;
  transition: baackground-color 0.2s ease;
  background-color: ${props =>
    props.isDraggingOver ? "skyblue" : "rgb(224, 221, 221)"};
  flex-grow: 1;
  min-height: 100px;
`;

const Column = props => {
  return (
    <Container>
      <Title checkedInTitle={props.column.title === "Checked In"}>
        {props.column.title}
      </Title>
      <Droppable droppableId={props.column.id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {props.tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                taskIndex={index}
                fontSize={"130%"}
                display={task.forename + " " + task.surname}
              />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
};

Column.propTypes = {
  column: PropTypes.object.isRequired,
  tasks: PropTypes.object.isRequired
};

export default Column;
