'use client'
import { useState } from 'react';
import { status } from '../../data';
import styles from './page.module.css'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { resetServerContext } from "react-beautiful-dnd"
const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    if (source.droppableId === "Elements") {
      const itemArray = destItems.map((data) => ({
        id: (Number(data.id) + Math.random()),
        content: data.content,
        type: data.type
      }))
      console.log(itemArray);
      setColumns({
        ...columns,
        [destination.droppableId]: {
          ...destColumn,
          items: itemArray
        }
      });
    } else {
      // setColumns({
      //   ...columns,
      //   [source.droppableId]: {
      //     ...sourceColumn,
      //     items: sourceItems
      //   },
      //   [destination.droppableId]: {
      //     ...destColumn,
      //     items: destItems
      //   }
      // });
    }

  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};


export default function Home() {
  resetServerContext()
  const [columns, setColumns] = useState(status);
  const handleDelete = (itemsObj, index, name) => {
    let { items } = columns[name]
    const arrayItem = items.filter((item) => item.id !== itemsObj.id)
    setColumns({
      ...columns,
      [name]: {
        name,
        items: [...arrayItem]
      }
    })
  }

  return (
    <div>
      <h1 style={{ textAlign: "center", padding: "2em" }}>Drag ad drop dashboard</h1>
      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "darkblue",
                            padding: 10,
                            width: 250,
                            minHeight: 500
                          }}
                        >
                          {column?.items?.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={String(item?.id)}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#263B4A"
                                          : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style
                                      }}
                                    >
                                      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>

                                        {item.type === "btn" && <button className={styles.btn}>{item.content}</button>}
                                        {item.type === "input" && <input className={styles.input} />}
                                        {item.type === "radio" && <div style={{ display: "flex", gap: "4px", justifyContent: "center", alignItems: "center" }}><input type='radio' name="gender" className={styles.radio} id={item.name + index} /><label style={{ cursor: "pointer" }} htmlFor={item.name + index}>man</label><input name="gender" type='radio' className={styles.radio} id={index + columnId} /><label style={{ cursor: "pointer" }} htmlFor={index + columnId}>woman</label></div>}
                                        {item.type === "checkbox" && <div style={{ display: "flex", gap: "4px", justifyContent: "center", alignItems: "center" }}><input className={styles.checkbox} type='checkbox' id='check' /><label htmlFor='check' style={{ cursor: "pointer" }}>Check it</label></div>}
                                        {item.type === "textarea" && <><textarea rows={5} cols={20} className={styles.textarea} /> </>}
                                        {column.name === "Area" && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" onClick={() => handleDelete(item, index, column.name)} className={styles.icon} strokeWidth={1} stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>}
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext >
      </div >
    </div >
  );
}

