import React from "react";
import { connect } from "react-redux";
import { addList } from "../redux/midarea/actions";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { getComponent } from "./getComponents";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { deepOrange } from "@material-ui/core/colors";

// Styling for MaterialUI Components
const useStyles = makeStyles(() =>
  createStyles({
    button: {
      margin: 0,
    },
  })
);

// Customized button for Running Lists
const RunButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    fontSize: "13px",
    "&:hover": {
      backgroundColor: deepOrange[700],
    },
  },
}))(Button);

// Mid Area Component
function MidArea({ area_list, add_list, event_values }) {
  const classes = useStyles();
  const eventFire = (el, etype) => {
    if (el && el.fireEvent) {
      el.fireEvent("on" + etype);
    } else if (el) {
      var evObj = document.createEvent("Events");
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  };

  // Handle Running the list
  const handleClick = (arr, id) => {
    if (arr.length === 0) return;
    let i = 0;

    let repeat = 1;

    let str1 = `comp${arr[i]}-${id}-${i}`;

    // Handle Repeat at first index
    if (arr[i] !== "REPEAT") {
      eventFire(document.getElementById(str1), "click");
    } else {
      repeat = event_values.repeat[str1] + 1;
    }
    i++;

    /* Each function execution takes 2 seconds */
    var cnt = setInterval(() => {
      if (i === arr.length) {
        clearInterval(cnt);
      }

      // Handle Repeat Component at current index
      if (arr[i] === "REPEAT") {
        let str2 = `comp${arr[i]}-${id}-${i}`;
        repeat = repeat * (event_values.repeat[str2] + 1);
        i++;
      }
      // If Repeat component is at previous index
      else if (arr[i - 1] === "REPEAT" && repeat > 2) {
        let str2 = `comp${arr[i]}-${id}-${i}`;
        eventFire(document.getElementById(str2), "click");
        repeat--;
      } else {
        let str2 = `comp${arr[i]}-${id}-${i}`;
        eventFire(document.getElementById(str2), "click");
        i++;
      }
    }, 2000);
  };
  return (
    <div className="px-3 py-6">
      <div className="">
        <div className="py-3">
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<AddIcon />}
            onClick={() => add_list()}
          >
            Add Block{" "}
          </Button>
        </div>
      </div>
      <div className="flex flex-row flex-wrap">
        {area_list.midAreaLists.map((l) => {
          return (
            <div className="m-3" key={l.id}>
              <div className="w-52 border border-2 border-gray-300 border-radius-2 p-2">
                <Droppable droppableId={l.id} type="COMPONENTS">
                  {(provided) => {
                    return (
                      <ul
                        className={`${l.id} w-48 h-full`}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        <div className="text-center mx-1 my-2 mb-4">
                          <RunButton
                            variant="contained"
                            className={classes.button}
                            startIcon={<PlayArrowIcon />}
                            onClick={() => handleClick(l.comps, l.id)}
                          >
                            Run{" "}
                          </RunButton>
                        </div>

                        {l.comps &&
                          l.comps.map((x, i) => {
                            let str = `${x}`;
                            let component_id = `comp${str}-${l.id}-${i}`;

                            return (
                              <Draggable
                                key={`${str}-${l.id}-${i}`}
                                draggableId={`${str}-${l.id}-${i}`}
                                index={i}
                              >
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {getComponent(str, component_id)}
                                    {provided.placeholder}
                                  </li>
                                )}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                      </ul>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// mapping state to props
const mapStateToProps = (state) => {
  return {
    area_list: state.list,
    event_values: state.event,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    add_list: () => dispatch(addList()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MidArea);
