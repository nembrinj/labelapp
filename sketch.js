/**
 * @file Webapp for labeling.
 * @author Feller Maxence
 * @version 6.0
 */

// Variables initialization
let input_Image;
let img;
let img_name;
let img_x;
let img_y;
let img_final_x;
let img_final_y;
let inp_date_value = ''
let points = Array()
let labels_number = 3
let colors = Array(Array(255,0,0),Array(255,128,0),Array(255,255,0),Array(0,255,0),Array(0,255,255),Array(0,128,255),Array(0,0,255),Array(128,0,255),Array(255,0,255),Array(255,0,128),Array(255,204,153),Array(153,255,153),Array(153,153,255),Array(102,51,0),Array(0,102,0),Array(0,102,102),Array(102,0,51),Array(255,255,255),Array(128,128,128),Array(0,0,0))
let labels_names =['Label 1','Label 2','Label 3','Label 4','Label 5','Label 6','Label 7','Label 8','Label 9','Label 10','Label 11','Label 12','Label 13','Label 14','Label 15','Label 16','Label 17','Label 18','Label 19','Label 20']
let selected_label = labels_names[0]
let selected_label_index = 0
let inp_rename_value = ''
// The variable 'add_delete' can be 'select', 'add', 'delete', 'set_origin', 'delete_origin', 'set_scale' or 'delete_scale'
let add_delete = 'add'
// The variable 'change' gives the possibility to change an 'add_delete' value or not
let change = 0
let points_number = 0
let id_ = 1
let selected_point = 0
let size_point = 2.5
let json_export = {};
let json_import;
let inp_export_name = ''
let now;
let inp_distance;
let inp_distance_value;
let origin_number = 0;
let scale_number = 0;
// The Array 'missing' says if the origin or the scale are missing ( = 'yes') and/or if the distance is false ( = 'no_f')
let missing = ['yes','yes','yes']
let missing_warning = 'all'
let text_size = 15
let parts = 8;
let angle = 360/parts;
let wheel_part = 0;
let atan_i;
let n;
let userAgent = navigator.userAgent;
let browserName;
let size_window = true;
let count_lock = 0;

/**
 * Function to set up every element on the screen and the datetime
 * @function
 */
function setup() {

  find_browser();

  now = str(year())+'-'+str(month())+'-'+str(day())+' '+str(hour())+':'+str(minute())+':'+str(second())

  input_Image = createFileInput(handleFile_Image);
  input_Image.position(115, 15);
  if (browserName == 'safari'){
    // To reduce the button size (standard is to long, with file name)
    input_Image.size(100);
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera' || browserName == 'No browser detected'){
    input_Image.size(118);
  } else if (browserName == 'firefox'){
    input_Image.size(80);
  }

  createCanvas(windowWidth, windowHeight);

  button_now = createButton('Reset all dates & times to current values');
  if (browserName == 'safari'){
    button_now.size(228,20);
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera'){
    button_now.size(255,20);
  } else if (browserName == 'firefox' || browserName == 'No browser detected'){
    button_now.size(270,20);
  }
  button_now.position(15, 135);
  button_now.mousePressed(button_now_pressed);

  button_export = createButton('Export data');
  if (browserName == 'safari'){
    button_export.size(80,20);
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera' || browserName == 'firefox' || browserName == 'No browser detected'){
    button_export.size(85,20);
  }
  button_export.position(15, 75);
  button_export.mousePressed(button_export_pressed);

  let inp_export = createInput('');
  inp_export.position(170, 74);
  inp_export.size(100);
  inp_export.input(myInputExport);

  input_Import = createFileInput(handleFile_Import);
  input_Import.position(115, 45);
  if (browserName == 'safari'){
    input_Import.size(100);
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera' || browserName == 'No browser detected'){
    input_Import.size(118);
  } else if (browserName == 'firefox'){
    input_Import.size(80);
  }

  button_plus = createButton('+');
  button_plus.size(24,24);
  button_plus.position((windowWidth/3)*2+190, 12);
  button_plus.mousePressed(button_plus_pressed);

  button_minus = createButton('-');
  button_minus.size(24,24);
  button_minus.position((windowWidth/3)*2+222, 12);
  button_minus.mousePressed(button_minus_pressed);

  button_plus_wheel = createButton('+');
  button_plus_wheel.size(24,24);
  if (browserName == 'safari'){
    button_plus_wheel.position((windowWidth/3)*2+223, 132);
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera' || browserName == 'firefox' || browserName == 'No browser detected'){
    button_plus_wheel.position((windowWidth/3)*2+228, 132);
  }
  button_plus_wheel.mousePressed(button_plus_wheel_pressed);

  button_minus_wheel = createButton('-');
  button_minus_wheel.size(24,24);
  if (browserName == 'safari'){
    button_minus_wheel.position((windowWidth/3)*2+255, 132);
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera' || browserName == 'firefox' || browserName == 'No browser detected'){
    button_minus_wheel.position((windowWidth/3)*2+260, 132);
  }
  button_minus_wheel.mousePressed(button_minus_wheel_pressed);

  inp_rename = createInput('');
  inp_rename.position((windowWidth/3)*2+136, 73);
  inp_rename.size(78);
  inp_rename.input(myInputEvent);

  button_rename = createButton('Rename');
  if (browserName == 'safari'){
    button_rename.size(60,20);
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera' || browserName == 'firefox' || browserName == 'No browser detected'){
    button_rename.size(65,20);
  }
  button_rename.position((windowWidth/3)*2+222, 74);
  button_rename.mousePressed(button_rename_pressed);

  inp_distance = createInput('');
  inp_distance.position((windowWidth/3)+225, 104);
  if (browserName == 'safari'){
    inp_distance.size(60);
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera' || browserName == 'No browser detected'){
    inp_distance.size(67);
  } else if (browserName == 'firefox'){
    inp_distance.size(80);
  }
  inp_distance.input(myInputDistance);

  slider_size_point = createSlider(0.5, 5, 2.5,0.5);
  if (browserName == 'safari'){
    slider_size_point.position((windowWidth/3)+96, 137);
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera' || browserName == 'No browser detected'){
    slider_size_point.position((windowWidth/3)+96, 136);
  } else if (browserName == 'firefox'){
    slider_size_point.position((windowWidth/3)+96, 134);
  }
  slider_size_point.style('width','70px')

  button_delete_all = createButton('Delete all points');
  if (browserName == 'safari'){
    button_delete_all.size(105,20);
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera'){
    button_delete_all.size(112,20);
  } else if (browserName == 'firefox' || browserName == 'No browser detected'){
    button_delete_all.size(125,20);
  }
  button_delete_all.position((windowWidth/3)+180, 135);
  button_delete_all.mousePressed(button_delete_all_pressed);

}

/**
 * Function find the browser type
 * @function
 */
function find_browser(){
  // Edge and Opera seem to be interpreted as Chrome. Since they do not need any other specification than Chrome, it is not a problem for the moment.
  // Safari and Chrome and Firefox are checked. Edge and Opera are used as Chrome and are checked in this way too.
  if (userAgent.match(/chrome|chromium|crios/i)){
    browserName = 'chrome'
  } else if (userAgent.match(/safari/i)){
    browserName = 'safari'
  } else if (userAgent.match(/firefox|fxios/i)){
    browserName = 'firefox'
  } else if (userAgent.match(/opr\//i)){
    browserName = 'opera'
  } else if (userAgent.match(/edg/i) || /Edge/.test(navigator.userAgent)){
    browserName = 'edge'
  } else {
    browserName = 'No browser detected'
    alert('Your browser is not detected. It will be interpreted as Chrome.');
  }
}

/**
 * Function to set all points datetime to the actual datetime when the corresponding button is clicked
 * @function
 */
function button_now_pressed() {
  if (confirm("By clicking on \"ok\", you will reset the date and time of all your points by the actual date and time.")){
    now = str(year())+'-'+str(month())+'-'+str(day())+' '+str(hour())+':'+str(minute())+':'+str(second())
    for (let i = 0; i < points_number; i++){
      points[i].date = now
    }
  }
}

/**
 * Function to export an information file when the corresponding button is clicked
 * @function
 */
function button_export_pressed() {
  if (missing[0] == 'no' && missing[1] == 'no' && missing[2] == 'no'){
    now = str(year())+'-'+str(month())+'-'+str(day())+' '+str(hour())+':'+str(minute())+':'+str(second())
    let o_x;
    let o_y;
    let s_x;
    let s_y;
    for (let i = 0; i < points_number; i++){
      if (points[i].type == 'origin' || points[i].type == 'selected_origin'){
        o_x = points[i].x
        o_y = points[i].y
      }
      if (points[i].type == 'scale' || points[i].type == 'selected_scale'){
        s_x = points[i].x
        s_y = points[i].y
      }
    }
    let ratio_p_m = inp_distance_value/sqrt(pow(o_x-s_x,2)+pow(o_y-s_y,2));
    let points_meters = Array()
    for (let i = 0; i < points_number; i++){
      points_meters.push({date: points[i].date, id_: points[i].id_, type: points[i].type, x:(points[i].x-o_x)*ratio_p_m, y:(points[i].y-o_y)*ratio_p_m, imgW:points[i].imgW, imgH:points[i].imgH, color:points[i].color, label:points[i].label, direction:points[i].direction})
    }
    // Information for information recovery
    points_meters.push({labels_number:labels_number,labels_names:labels_names,selected_label:selected_label,selected_label_index:selected_label_index,add_delete:add_delete,change:change,points_number:points_number,id_:id_,selected_point:selected_point,origin_number:origin_number, scale_number:scale_number, o_x:o_x, o_y:o_y, s_x:s_x, s_y:s_y, ratio_p_m:ratio_p_m, inp_distance_value:inp_distance_value, parts:parts, wheel_part:wheel_part, size_point:size_point})
    // Save
    if (str(inp_export_name) == ''){
      saveJSON(points_meters,str(now)+'.json');
    } else {
      saveJSON(points_meters,str(inp_export_name)+'.json');
    }
  } else {
    alert('You cannot export your data now. \n\nFor more details, see the error written below the \"Export data\" button.')
  }
}

/**
 * Function to take into account the input for the name of the exported file
 * @function
 */
function myInputExport() {
  inp_export_name = this.value()
}

/**
 * Function to increase the number of labels when the corresponding button is clicked
 * @function
 */
function button_plus_pressed() {
  if (labels_number<20){
    labels_number = labels_number+1;
  }
}

/**
 * Function to decrease the number of labels when the corresponding button is clicked
 * @function
 */
function button_minus_pressed() {
  let need_confirm = false;
  for (let i = 0; i < points_number; i++){
    if(points[i].color == colors[labels_number-1] && points[i].type != 'deleted'){
      need_confirm = true;
    }
  }
  if (need_confirm == true){
    if (confirm("There are points drawn with the label \""+str(labels_names[labels_number-1])+"\". \n\nBy clicking on \"ok\", you will delete all your points with this label.")){
      decrease_labels_number();
    }
  } else {
    decrease_labels_number();
  }
}

/**
 * Function to decrease the number of labels, called during "button_minus_pressed"
 * @function
 */
function decrease_labels_number() {
  if (labels_number>1){
    labels_number = labels_number-1;
    if(labels_number == selected_label_index){
      selected_label_index = selected_label_index-1
      selected_label = labels_names[selected_label_index]
    }
  }
  for (let i = 0; i < points_number; i++){
    if (points[i].color == colors[labels_number]){
      points[i].type = 'deleted'
    }
  }
}

/**
 * Function to increase the number of wheel parts when the corresponding button is clicked
 * @function
 */
function button_plus_wheel_pressed() {
  if (parts < 90){
    parts = parts + 1
  }
}

/**
 * Function to decrease the number of wheel parts when the corresponding button is clicked
 * @function
 */
function button_minus_wheel_pressed() {
  if (parts > 2){
      parts = parts - 1
  }
}

/**
 * Function to manage renaming when the corresponding button is clicked
 * @function
 */
function button_rename_pressed() {
  labels_names[selected_label_index] = inp_rename_value
  inp_rename = createInput('');
  inp_rename.position((windowWidth/3)*2+136, 73);
  inp_rename.size(78);
  inp_rename.input(myInputEvent);
  for (let i = 0; i < labels_number; i++){
    if (labels_names[i]==selected_label){
      selected_label_index = i
    }
  }
  for (let i = 0; i < points_number; i++){
    for (let j = 0; j < labels_number; j++){
      if (points[i].color == colors[j]){
        points[i].label = labels_names[j]
      }
    }
  }
  selected_label = labels_names[selected_label_index]
}

/**
 * Function to take into account the input for the scale point distance
 * @function
 */
function myInputDistance() {
  inp_distance_value = this.value()
}

/**
 * Function to select a label when a label is clicked
 * @function
 */
function mySelectEvent() {
  for (let i = 0; i < labels_number; i++){
    if (labels_names[i]==selected_label){
      selected_label_index = i
    }
  }
  // Change the label of a selected point
  if (add_delete == 'select'){
    for (let i = 0; i < points_number; i++){
      if (points[i].type == 'selected'){
        points[i].color = colors[selected_label_index]
      }
    }
  }
}

/**
 * Function to manage mouse clicked
 * @function
 */
function mouseClicked() {
  // Listener added in case someone clicked on something, to prevent losing data
  // It is important to add it after the user made an action, here the click, otherwise no warning will be made.
  window.addEventListener('beforeunload', (event) => {
    event.returnValue = 'Are you sure you want to leave?';
  });

  let c = colors[selected_label_index]
  // ... if mouse is in the drawing area
  if (mouseY > 165 && mouseX < img_final_x){
    // ... for points addition
    if (add_delete == 'add'){
      now = str(year())+'-'+str(month())+'-'+str(day())+' '+str(hour())+':'+str(minute())+':'+str(second())
      points.push({date: now, id_: id_, type: 'normal', x:mouseX, y:mouseY-165, imgW:img_final_x, imgH:img_final_y, color:c, label:labels_names[selected_label_index], direction:[wheel_part*angle-angle/2,wheel_part*angle+angle/2]})
      points_number = points_number+1
      id_ = id_ + 1
    }
    // ... for points deletion
    if (add_delete == 'delete'){
      closest()
      for (let i = 0; i < points_number; i++){
        if (points[i].id_ == selected_point){
          points[i].type = 'deleted'
        }
      }
    }
    // ... for points selection
    if (add_delete == 'select'){
      if (points_number > 0){
        for (let i = 0; i < points_number; i++){
          if (points[i].type == 'selected'){
            points[i].type = 'normal'
          }
          if (points[i].type == 'selected_origin'){
            points[i].type = 'origin'
          }
          if (points[i].type == 'selected_scale'){
            points[i].type = 'scale'
          }
        }
        closest()
      }
    }
    // ... for origin setting
    if (add_delete == 'set_origin'){
      if (origin_number < 1){
        now = str(year())+'-'+str(month())+'-'+str(day())+' '+str(hour())+':'+str(minute())+':'+str(second())
        points.push({date: now, id_: id_, type: 'origin', x:mouseX, y:mouseY-165, imgW:img_final_x, imgH:img_final_y, color:[0,0,0], label:'origin'})
        origin_number = 1
        points_number = points_number+1
        id_ = id_ + 1
      }
    }
    // ... for origin deletion
    if (add_delete == 'delete_origin'){
      for (let i = 0; i < points_number; i++){
        if (points[i].type == 'origin' || points[i].type == 'selected_origin'){
          points[i].type = 'deleted_origin'
        }
      }
      origin_number = origin_number - 1
    }
    // ... for scale point setting
    if (add_delete == 'set_scale'){
      if (scale_number < 1){
        now = str(year())+'-'+str(month())+'-'+str(day())+' '+str(hour())+':'+str(minute())+':'+str(second())
        points.push({date: now, id_: id_, type: 'scale', x:mouseX, y:mouseY-165, imgW:img_final_x, imgH:img_final_y, color:[128,128,128], label:'scale'})
        scale_number = 1
        points_number = points_number+1
        id_ = id_ + 1
      }
    }
    // ... for scale point deletion
    if (add_delete == 'delete_scale'){
      for (let i = 0; i < points_number; i++){
        if (points[i].type == 'scale' || points[i].type == 'selected_scale'){
          points[i].type = 'deleted_scale'
        }
      }
      scale_number = scale_number - 1
    }
  }
  // ... if mouse is on the 'add' text
  if((mouseX > (windowWidth/3)+15) && (mouseX < (windowWidth/3)+41) && (mouseY > 15) && (mouseY < 30)){
    if (add_delete != 'add'){
      add_delete = 'add'
      if (points_number > 0){
        for (let i = 0; i < points_number; i++){
          if (points[i].type == 'selected'){
            points[i].type = 'normal'
          }
        }
      }
    }
  // ... if mouse is on the 'delete' text
  } else if((mouseX > (windowWidth/3)+52) && (mouseX < (windowWidth/3)+95) && (mouseY > 15) && (mouseY < 30)){
    if (add_delete != 'delete'){
      if (points_number > 0){
        for (let i = 0; i < points_number; i++){
          if (points[i].type == 'selected'){
            points[i].type = 'normal'
          }
        }
      }
      add_delete = 'delete'
    }
  // ... if mouse is on the 'update' text
} else if ((mouseX > (windowWidth/3)+106) && (mouseX < (windowWidth/3)+155) && (mouseY > 15) && (mouseY < 30)){
      add_delete = 'select'
  // ... if mouse is on the 'move' text
} else if ((mouseX > (windowWidth/3)+15) && (mouseX < (windowWidth/3)+78) && (mouseY > 45) && (mouseY < 60)){
  // ... if mouse is on the 'set origin' text
      add_delete = 'set_origin'
  // ... if mouse is on the 'delete origin' text
  } else if ((mouseX > (windowWidth/3)+89) && (mouseX < (windowWidth/3)+173) && (mouseY > 45) && (mouseY < 60)){
    if (points_number > 0){
      for (let i = 0; i < points_number; i++){
        if (points[i].type == 'selected'){
          points[i].type = 'normal'
        }
      }
    }
    add_delete = 'delete_origin'
  // ... if mouse is on the 'set scale point' text
  } else if ((mouseX > (windowWidth/3)+15) && (mouseX < (windowWidth/3)+114) && (mouseY > 75) && (mouseY < 90)){
      add_delete = 'set_scale'
  // ... if mouse is on the 'delete scale point' text
  } else if ((mouseX > (windowWidth/3)+125) && (mouseX < (windowWidth/3)+245) && (mouseY > 75) && (mouseY < 90)){
    if (points_number > 0){
      for (let i = 0; i < points_number; i++){
        if (points[i].type == 'selected'){
          points[i].type = 'normal'
        }
      }
    }
    add_delete = 'delete_scale'
  }
  // ... to always deselect the selected point when option is not 'select'
  if (add_delete != 'select'){
    for (let i = 0; i < points_number; i++){
      if (points[i].type == 'selected'){
        points[i].type = 'normal'
      }
      if (points[i].type == 'selected_origin'){
        points[i].type = 'origin'
      }
      if (points[i].type == 'selected_scale'){
        points[i].type = 'scale'
      }
    }
  }
  // ... if labels is clicked
  if (mouseY > 165 && mouseX > (windowWidth-141) && mouseY < (windowHeight-120)){
    textSize(text_size);
    for (let i = 0; i < labels_number; i++){
      if ((mouseX > windowWidth-140) && (mouseX < windowWidth) && (mouseY > 166+(text_size*2)*(i+1.25)) && (mouseY < 164+(text_size*2)*(i+2.25))){
        selected_label = labels_names[i]
        mySelectEvent();
      }
    }
  }
  // ... if wheel is clicked
  if (check_if_in_circle(mouseX,mouseY)){
    find_circle_part(mouseX,mouseY);
    for (let i = 0; i < points_number; i++){
      if (points[i].type == 'selected'){
        points[i].direction[0] = wheel_part*angle-angle/2
        points[i].direction[1] = wheel_part*angle+angle/2
      }
    }
  }
}

/**
 * Function to find which part of the wheel is clicked
 * @function
 * @param {number} x - The x coordinate of the mouse when clicked
 * @param {number} y - The y coordinate of the mouse when clicked
 */
function find_circle_part(x,y){
  angleMode(DEGREES);
  atan_i = atan((windowHeight-60-y)/(windowWidth-70-x))
  if (parts%2 == 0){
    n = parts/2+1
    if (atan_i == -90){
      wheel_part = int(parts/2)
    }
    if (atan_i == 90){
      wheel_part = 0
    }
    for (let i = 0; i < n; i++){
      if (i == 0){
        if (atan_i > -89.99 && atan_i < -90.01+angle/2){
          if (mouseX > windowWidth-70){
            wheel_part = i
          } else {
            wheel_part = i+(n-1)
          }
        }
      } else if (i == n-1){
        if (atan_i > -89.99+i*angle-angle/2 && atan_i < 89.99){
          if (mouseX > windowWidth-70){
            wheel_part = i
          } else {
            wheel_part = 0
          }
        }
      } else {
        if (atan_i > -89.99+angle/2+(i-1)*angle && atan_i < -90.1+angle/2+i*angle){
          if (mouseX > windowWidth-70){
            wheel_part = i
          } else {
            wheel_part = i+(n-1)
          }
        }
      }
    }
  } else {
    n = int(parts/2+1)
    if (atan_i == 90){
      wheel_part = 0
    }
    for (let i = 0; i < n; i++){
      if (mouseX > windowWidth-70){
        if (i == 0){
          if (atan_i > -89.99 && atan_i < -90.01+angle/2){
            wheel_part = i
          }
        } else {
          if (atan_i > -89.99+angle/2+(i-1)*angle && atan_i < -90.01+angle/2+i*angle){
            wheel_part = i
          }
        }
      } else {
        if (i == n-1){
          if (atan_i > -89.99+i*angle && atan_i < 89.99){
            wheel_part = 0
          }
        } else {
          if (atan_i > -89.99+i*angle && atan_i < -90.01+(i+1)*angle){
            wheel_part = i+n
          }
        }
      }
    }
  }
}

/**
 * Function to find the closest points for selection, deletion or dragging
 * @function
 */
function closest() {
  if (add_delete == 'delete' || add_delete == 'select'){
    let x = mouseX
    let y = mouseY
    let best;
    let best_distance = sqrt(pow((windowWidth),2)+pow((windowHeight),2));
    for (let i = 0; i < points_number; i++){
      if (points[i].type != 'deleted'){
        if (sqrt(pow(((x*points[i].imgW/img_final_x)-points[i].x),2)+pow((((y-165)*points[i].imgH/img_final_y)-points[i].y),2)) < best_distance){
          if (add_delete == 'delete'){
            if (points[i].type != 'origin' && points[i].type != 'scale'){
              best_distance = sqrt(pow(((x*points[i].imgW/img_final_x)-points[i].x),2)+pow((((y-165)*points[i].imgH/img_final_y)-points[i].y),2))
              best = points[i].id_
            }
          } else {
            best_distance = sqrt(pow(((x*points[i].imgW/img_final_x)-points[i].x),2)+pow((((y-165)*points[i].imgH/img_final_y)-points[i].y),2))
            best = points[i].id_
          }
        }
      }
    }
    selected_point = best
    for (let i = 0; i < points_number; i++){
      if (points[i].id_ == best){
        if (points[i].type == 'normal'){
          points[i].type = 'selected'
        }
        if (points[i].type == 'origin'){
          points[i].type = 'selected_origin'
        }
        if (points[i].type == 'scale'){
          points[i].type = 'selected_scale'
        }
      }
    }
  }
}

/**
 * Function to take into account the input for renaming labels
 * @function
 */
function myInputEvent() {
  inp_rename_value = this.value()
}

/**
 * Function to delete all points
 * @function
 */
function button_delete_all_pressed() {
  if (confirm("By clicking on \"ok\", you will delete all your points.")){
    points = Array()
    points_number = 0
    id_ = 1
    origin_number = 0
    scale_number = 0
  }
}

/**
 * Function to draw points
 * @function
 * @param {Object} pt - The point to be drawn
 */
function drawpoint(pt) {
  size_point = slider_size_point.value();
  fill(pt.color)
  if (pt.type == 'normal'){
    line(pt.x/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y,pt.x/pt.imgW*img_final_x+(6*size_point)*cos(-90+pt.direction[0]),165+pt.y/pt.imgH*img_final_y+(6*size_point)*sin(-90+pt.direction[0]));
    line(pt.x/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y,pt.x/pt.imgW*img_final_x+(6*size_point)*cos(-90+pt.direction[1]),165+pt.y/pt.imgH*img_final_y+(6*size_point)*sin(-90+pt.direction[1]));
    noFill();
    angleMode(RADIANS);
    arc(pt.x/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y, 12*size_point, 12*size_point, (-90+pt.direction[0])*PI/180, (-90+pt.direction[1])*PI/180);
    angleMode(DEGREES);
    fill(pt.color)
    ellipse(pt.x/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y, 5*size_point, 5*size_point);
  }
  if (pt.type == 'selected'){
    line(pt.x/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y,pt.x/pt.imgW*img_final_x+(9.6*size_point)*cos(-90+pt.direction[0]),165+pt.y/pt.imgH*img_final_y+(9.6*size_point)*sin(-90+pt.direction[0]));
    line(pt.x/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y,pt.x/pt.imgW*img_final_x+(9.6*size_point)*cos(-90+pt.direction[1]),165+pt.y/pt.imgH*img_final_y+(9.6*size_point)*sin(-90+pt.direction[1]));
    noFill();
    angleMode(RADIANS);
    arc(pt.x/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y, 19.2*size_point, 19.2*size_point, (-90+pt.direction[0])*PI/180, (-90+pt.direction[1])*PI/180);
    angleMode(DEGREES);
    fill(pt.color)
    ellipse(pt.x/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y, 8*size_point, 8*size_point);
  }
  if (pt.type == 'origin'){
    noFill();
    circle(pt.x/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y,5*size_point);
    line((pt.x-4*size_point)/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y,(pt.x+4*size_point)/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y);
    line(pt.x/pt.imgW*img_final_x,165+(pt.y-4*size_point)/pt.imgH*img_final_y,pt.x/pt.imgW*img_final_x,165+(pt.y+4*size_point)/pt.imgH*img_final_y);
  }
  if (pt.type == 'selected_origin'){
    noFill();
    circle(pt.x/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y,8*size_point);
    line((pt.x-6.4*size_point)/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y,(pt.x+6.4*size_point)/pt.imgW*img_final_x,165+pt.y/pt.imgH*img_final_y);
    line(pt.x/pt.imgW*img_final_x,165+(pt.y-6.4*size_point)/pt.imgH*img_final_y,pt.x/pt.imgW*img_final_x,165+(pt.y+6.4*size_point)/pt.imgH*img_final_y);
  }
  if (pt.type == 'scale'){
    fill(0,0,0);
    triangle((pt.x-2.5*size_point)/pt.imgW*img_final_x,165+(pt.y+(2.5*sqrt(3)/2)*size_point)/pt.imgH*img_final_y,pt.x/pt.imgW*img_final_x,165+(pt.y-(2.5*sqrt(3)/2)*size_point)/pt.imgH*img_final_y,(pt.x+2.5*size_point)/pt.imgW*img_final_x,165+(pt.y+(2.5*sqrt(3)/2)*size_point)/pt.imgH*img_final_y);
  }
  if (pt.type == 'selected_scale'){
    fill(0,0,0);
    triangle((pt.x-4*size_point)/pt.imgW*img_final_x,165+(pt.y+(4*sqrt(3)/2)*size_point)/pt.imgH*img_final_y,pt.x/pt.imgW*img_final_x,165+(pt.y-(4*sqrt(3)/2)*size_point)/pt.imgH*img_final_y,(pt.x+4*size_point)/pt.imgW*img_final_x,165+(pt.y+(4*sqrt(3)/2)*size_point)/pt.imgH*img_final_y);
  }
}

/**
 * Function to handle an imported image (= map)
 * @function
 * @param {object} file - The image file to create the map
 */
function handleFile_Image(file) {
  if (file.type === 'image') {
    img = createImg(file.data,'');
    img.hide();
  } else {
    alert('Something went wrong. \nThe chosen file type was \"'+str(file.type)+'\".\n\nYou need to add an image type file.');
  }
}

/**
 * Function to handle an imported file
 * @function
 * @param {object} file - The importation file
 */
function handleFile_Import(file) {
  if (file.type === 'application') {
    let file_data = file.data;
    let save_last = file_data[file_data.length-1];
    // Check the first saved variable and the x value of the first saved point to determine if the file content seems to be fine.
    if (isNaN(save_last.labels_number)|isNaN(file_data[0].x)){
      alert('Something went wrong. \nThe file content does not correspond to the content needed. \n\nPlease check your file and try again.');
    } else {
      file_data.pop();
      points = file_data
      labels_number = int(save_last.labels_number)
      labels_names = save_last.labels_names
      selected_label = save_last.selected_label
      selected_label_index = int(save_last.selected_label_index)
      add_delete = save_last.add_delete
      points_number = int(save_last.points_number)
      id_ = int(save_last.id_)
      selected_point = int(save_last.selected_point)
      origin_number = int(save_last.origin_number)
      scale_number = int(save_last.scale_number)
      size_point = int(save_last.size_point)
      inp_distance.value(float(save_last.inp_distance_value));
      inp_distance_value = float(save_last.inp_distance_value)
      parts = int(save_last.parts)
      wheel_part = int(save_last.wheel_part)
      slider_size_point.remove();
      slider_size_point = createSlider(0.5, 5, size_point,0.5);
      slider_size_point.style('width','70px')
      let o_x = float(save_last.o_x);
      let o_y = float(save_last.o_y);
      let s_x = float(save_last.s_x);
      let s_y = float(save_last.s_y);
      let ratio_p_m = float(save_last.ratio_p_m);
      for (let i = 0; i < points_number; i++){
        points[i].id_ = int(points[i].id_)
        points[i].x = float(points[i].x/ratio_p_m)+o_x
        points[i].y = float(points[i].y/ratio_p_m)+o_y
      }
    }
  } else {
    alert('Something went wrong. \nThe chosen file type was \"'+str(file.type)+'"\.\n\nYou need to add an application type file.');
  }
}

/**
 * Function to manage mouse mouvements (to detect if a text or a part of the wheel is clickable)
 * @function
 */
function mouseMoved() {
  // ... to select options
  if((mouseX > (windowWidth/3)+15) && (mouseX < (windowWidth/3)+41) && (mouseY > 15) && (mouseY < 30)){
    cursor(HAND);
  } else if((mouseX > (windowWidth/3)+52) && (mouseX < (windowWidth/3)+95) && (mouseY > 15) && (mouseY < 30)){
    cursor(HAND);
  } else if ((mouseX > (windowWidth/3)+106) && (mouseX < (windowWidth/3)+155) && (mouseY > 15) && (mouseY < 30)){
    cursor(HAND);
  } else if ((mouseX > (windowWidth/3)+15) && (mouseX < (windowWidth/3)+78) && (mouseY > 45) && (mouseY < 60)){
    cursor(HAND);
  } else if ((mouseX > (windowWidth/3)+89) && (mouseX < (windowWidth/3)+173) && (mouseY > 45) && (mouseY < 60)){
    cursor(HAND);
  } else if ((mouseX > (windowWidth/3)+15) && (mouseX < (windowWidth/3)+114) && (mouseY > 75) && (mouseY < 90)){
    cursor(HAND);
  } else if ((mouseX > (windowWidth/3)+125) && (mouseX < (windowWidth/3)+245) && (mouseY > 75) && (mouseY < 90)){
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
  // ... to select labels
  textSize(text_size);
  for (let i = 0; i < labels_number; i++){
    if ((mouseX > windowWidth-140) && (mouseX < windowWidth) && (mouseY > 166+(text_size*2)*(i+1.25)) && (mouseY < 164+(text_size*2)*(i+2.25))){
      cursor(HAND);
    }
  }
  // ... to select a part of the wheel
  if (check_if_in_circle(mouseX,mouseY)){
    angleMode(DEGREES);
    atan_i = atan((windowHeight-60-mouseY)/(windowWidth-70-mouseX))
    if (parts%2 == 0){
      n = parts/2+1
      if (atan_i == -90){
        cursor(HAND);
      }
      if (atan_i == 90){
        cursor(HAND);
      }
      for (let i = 0; i < n; i++){
        if (i == 0){
          if (atan_i > -89.99 && atan_i < -89.99+angle/2-0.02){
            cursor(HAND);
          }
        } else if (i == n-1){
          if (atan_i > -89.99+i*angle-angle/2 && atan_i < 89.99){
            cursor(HAND);
          }
        } else {
          if (atan_i > -89.99+(i-1)*angle+angle/2 && atan_i < -90.01+(i)*angle+angle/2){
            cursor(HAND);
          }
        }
      }
    } else {
      n = int(parts/2)+1
      if (atan_i == 90){
        cursor(HAND);
      }
      for (let i = 0; i < n; i++){
        if (i == 0){
          if (atan_i > -89.99 && atan_i < -89.99+angle/2-0.02){
            cursor(HAND);
          }
        } else if (i == n-1){
          if (atan_i > -89.99+(i-1)*angle+angle/2 && atan_i < 89.99){
            cursor(HAND);
          }
        } else {
          if (atan_i > -89.99+(i-1)*angle+angle/2 && atan_i < -90.01+(i)*angle+angle/2){
            cursor(HAND);
          }
        }
      }
    }
  }
}

/**
 * Function to detect if the mouse is dragged
 * @function
 */
function mouseDragged() {
  count_lock += 1
  if (add_delete == 'select' && mouseX < img_final_x && mouseX > 0 && mouseY > 165 && mouseY < 165+img_final_y && count_lock > 5){
    drag_closest();
  }
}

/**
 * Function to detect if the mouse is released
 * @function
 */
function mouseReleased() {
  count_lock = 0
}

/**
 * Function to detect if the mouse is pressed
 * @function
 */
function mousePressed(){
  for (let i = 0; i < points_number; i++){
    if (points[i].type == 'selected' && mouseX < img_final_x && mouseY > 165){
      points[i].type = 'normal'
    }
  }
}

/**
 * Function to drag the closest point
 * @function
 */
function drag_closest(){
  closest();
  for (let i = 0; i < points_number; i++){
    if (points[i].type == 'selected'){
      points[i].x = mouseX*points[i].imgW/img_final_x
      points[i].y = (mouseY-165)*points[i].imgH/img_final_y
      points[i].type = 'normal'
    }
  }
}

/**
 * Function to check if a set of coordinates is in the wheel
 * @function
 * @param {number} x - The x coordinate of the mouse when moved
 * @param {number} y - The y coordinate of the mouse when moved
 * @returns {boolean}
*/
function check_if_in_circle(x,y){
  if (pow(x-(windowWidth-70),2)+pow(y-(windowHeight-60),2)<pow(50,2)){
    return true;
  }
}

/**
 * Function to manage keys pressed
 * @function
 */
function keyPressed(){
  // ... if a point is selected (to reposition it)
  if (add_delete == 'select'){
    if (keyCode === UP_ARROW){
      for (let i = 0; i < points_number; i++){
        if (points[i].type == 'selected' || points[i].type == 'selected_origin' || points[i].type == 'selected_scale'){
          if (points[i].y/points[i].imgH*img_final_y > 1){
            points[i].y = points[i].y -(points[i].imgH/img_final_y)
          }
        }
      }
    }
    if (keyCode === DOWN_ARROW){
      for (let i = 0; i < points_number; i++){
        if (points[i].type == 'selected' || points[i].type == 'selected_origin' || points[i].type == 'selected_scale'){
          if (points[i].y/points[i].imgH*img_final_y < img_final_y-1){
            points[i].y = points[i].y +(points[i].imgH/img_final_y)
          }
        }
      }
    }
    if (keyCode === LEFT_ARROW){
      for (let i = 0; i < points_number; i++){
        if (points[i].type == 'selected' || points[i].type == 'selected_origin' || points[i].type == 'selected_scale'){
          if (points[i].x/points[i].imgW*img_final_x > 1){
            points[i].x = points[i].x -(points[i].imgW/img_final_x)
          }
        }
      }
    }
    if (keyCode === RIGHT_ARROW){
      for (let i = 0; i < points_number; i++){
        if (points[i].type == 'selected' || points[i].type == 'selected_origin' || points[i].type == 'selected_scale'){
          if (points[i].x/points[i].imgW*img_final_x < img_final_x-1){
            points[i].x = points[i].x +(points[i].imgW/img_final_x)
          }
        }
      }
    }
  }
}

/**
 * Function to display warning information for export if needed
 * @function
 */
function missing_alert() {
  if (origin_number == 1){
    missing[0] = 'no'
  } else {
    missing[0] = 'yes'
  }
  if (scale_number == 1){
    missing[1] = 'no'
  } else {
    missing[1] = 'yes'
  }
  if (inp_distance_value != undefined && inp_distance_value != ''){
    if (!isNaN(inp_distance_value)){
      missing[2] = 'no'
    } else {
      missing[2] = 'no_f'
    }
  } else {
    missing[2] = 'yes'
  }
  if (missing[0] == 'yes'){
    if (missing[1] == 'no'){
      if (missing[2] == 'yes'){
        missing_warning = 'origin_distance'
      } else if (missing[2] == 'no'){
        missing_warning = 'origin'
      } else {
        missing_warning = 'origin_distance_f'
      }
    } else {
      if (missing[2] == 'yes'){
        missing_warning = 'origin_scale_distance'
      } else if (missing[2] == 'no'){
        missing_warning = 'origin_scale'
      } else {
        missing_warning = 'origin_scale_distance_f'
      }
    }
  } else {
    if (missing[1] == 'no'){
      if (missing[2] == 'yes'){
        missing_warning = 'distance'
      } else if (missing[2] == 'no'){
        missing_warning = 'nothing'
      } else {
        missing_warning = 'distance_f'
      }
    } else {
      if (missing[2] == 'yes'){
        missing_warning = 'scale_distance'
      } else if (missing[2] == 'no'){
        missing_warning = 'scale'
      } else {
        missing_warning = 'scale_distance_f'
      }
    }
  }
  if (missing_warning != 'nothing'){
    fill(204,0,0);
    if (missing_warning == 'origin'){
      text('Origin is missing.', 15, 120);
    } else if (missing_warning == 'scale'){
      text('Scale is missing.', 15, 120);
    } else if (missing_warning == 'distance'){
      text('Distance is missing.', 15, 120);
    } else if (missing_warning == 'distance_f'){
      text('Distance is false.', 15, 120);
    } else if (missing_warning == 'origin_scale'){
      text('Origin and scale are missing.', 15, 120);
    } else if (missing_warning == 'origin_distance'){
      text('Origin and distance are missing.', 15, 120);
    } else if (missing_warning == 'origin_distance_f'){
      text('Origin is missing, distance is false.', 15, 120);
    } else if (missing_warning == 'scale_distance'){
      text('Scale and distance are missing.', 15, 120);
    } else if (missing_warning == 'scale_distance_f'){
      text('Scale is missing, distance is false.', 15, 120);
    } else if (missing_warning == 'origin_scale_distance_f'){
      text('Origin and scale are missing, distance is false.', 15, 120);
    } else {
      text('Origin, scale and distance are missing.', 15, 120);
    }
  }
}

/**
 * Function to update the position of the buttons, inputs, ...
 * @function
 */
function position_update () {
  button_plus.position((windowWidth/3)*2+190, 12);
  button_minus.position((windowWidth/3)*2+222, 12);
  if (browserName == 'safari'){
    button_plus_wheel.position((windowWidth/3)*2+223, 132);
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera' || browserName == 'firefox' || browserName == 'No browser detected'){
    button_plus_wheel.position((windowWidth/3)*2+228, 132);
  }
  if (browserName == 'safari'){
    button_minus_wheel.position((windowWidth/3)*2+255, 132);
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera' || browserName == 'firefox' || browserName == 'No browser detected'){
    button_minus_wheel.position((windowWidth/3)*2+260, 132);
  }
  inp_rename.position((windowWidth/3)*2+136, 73);
  button_rename.position((windowWidth/3)*2+222, 74);
  inp_distance.position((windowWidth/3)+225, 104);
  if (browserName == 'safari'){
    slider_size_point.position((windowWidth/3)+96, 137);
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera' || browserName == 'No browser detected'){
    slider_size_point.position((windowWidth/3)+96, 136);
  } else if (browserName == 'firefox'){
    slider_size_point.position((windowWidth/3)+96, 134);
  }
  button_delete_all.position((windowWidth/3)+180, 135);
}

/**
 * Function to resize the text size for the labels display
 * @function
 */
function set_label_display_sizes(){
  let area_labels = windowHeight-165-120; //-120 corresponds to the wheel area
  if (area_labels < text_size*((labels_number+1)*2+1)){
    text_size = text_size-0.25
    set_label_display_sizes();
  } else if (area_labels >(text_size+0.25)*((labels_number+1)*2+1) && text_size <= 14.75){
    text_size = text_size+0.25
    set_label_display_sizes();
  }
}

/**
 * Function to manage what will appear on screen
 * @function
 */
function draw() {

  // Resizes the canvas
  resizeCanvas(windowWidth, windowHeight);

  // Draws background
  background(240);

  // Draws image
  if (img) {
    img_x = img.width
    img_y = img.height
    if (img_y/(windowHeight-165) > img_x/(windowWidth-140)){
      img_final_y = (windowHeight-165)
      img_final_x = img_final_y*img_x/img_y
    } else {
      img_final_x = (windowWidth-140)
      img_final_y = (img_final_x*img_y/img_x)
    }
    image(img, 0, 165, img_final_x, img_final_y);
  }

  // Draws points
  points.forEach(drawpoint);

  // Draws line between origin and scale points
  if (origin_number == 1 && scale_number == 1){
    fill(128,128,128)
    let o_x;
    let o_y;
    let s_x;
    let s_y;
    for (let i = 0; i < points_number; i++){
      if (points[i].type == 'origin' || points[i].type == 'selected_origin'){
        o_x = points[i].x/points[i].imgW*img_final_x
        o_y = 165+points[i].y/points[i].imgH*img_final_y
      }
      if (points[i].type == 'scale' || points[i].type == 'selected_scale'){
        s_x = points[i].x/points[i].imgW*img_final_x
        s_y = 165+points[i].y/points[i].imgH*img_final_y
      }
    }
    line(o_x,o_y,s_x,s_y);
  }

  // Draws a grey rectangle to avoid points to cross the setting line
  fill(240,240,240);
  rect(-1,-1,windowWidth+2,166);

  // Draws a grey rectangle for the labels display part
  fill(240,240,240);
  rect(windowWidth-141,165,142,windowHeight-164);

  // Updates the position of the buttons, inputs, ...
  position_update();

  // Draws the texts
  textSize(15);
  fill(0, 0, 0);
  text('Map file :', 15, 30);
  fill(0, 0, 0);
  text('Import data :', 15, 60);
  fill(0, 0, 0);
  text('Name :', 115, 90);
  // Adds warning if needed
  missing_alert();
  fill(0, 0, 0);
  text('Number of labels :', (windowWidth/3)*2+15, 30);
  fill(0, 0, 0);
  if (labels_number > 9){
      text(labels_number, (windowWidth/3)*2+156, 30);
  } else {
      text(labels_number, (windowWidth/3)*2+160, 30);
  }
  fill(0, 0, 0);
  text('Selected label :', (windowWidth/3)*2+15, 60);
  fill(colors[selected_label_index][0],colors[selected_label_index][1],colors[selected_label_index][2]);
  text(selected_label, (windowWidth/3)*2+135, 60);
  fill(0,0,0);
  text('Rename label :', (windowWidth/3)*2+15, 90);
  fill(0,0,0);
  text('Number of wheel parts :', (windowWidth/3)*2+15, 150);
  fill(0,0,0);
  if (browserName == 'safari'){
    if (parts > 99){
      text(parts, (windowWidth/3)*2+185, 150);
    } else if (parts > 9 && parts < 100){
      text(parts, (windowWidth/3)*2+189, 150);
    } else {
      text(parts, (windowWidth/3)*2+193, 150);
    }
  } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera' || browserName == 'firefox' || browserName == 'No browser detected'){
    if (parts > 99){
      text(parts, (windowWidth/3)*2+188, 150);
    } else if (parts > 9 && parts < 100){
      text(parts, (windowWidth/3)*2+192, 150);
    } else {
      text(parts, (windowWidth/3)*2+196, 150);
    }
  }
  if (add_delete == 'add'){
    fill(0, 204, 0);
    text('Add', (windowWidth/3)+15, 30);
  } else {
    fill(0, 0, 0);
    text('Add', (windowWidth/3)+15, 30);
  }
  fill(0, 0, 0);
  text('|', (windowWidth/3)+45, 30);
  if (add_delete == 'delete'){
    fill(204, 0, 0);
    text('Delete', (windowWidth/3)+52, 30);
  } else {
    fill(0, 0, 0);
    text('Delete', (windowWidth/3)+52, 30);
  }
  fill(0, 0, 0);
  text('|', (windowWidth/3)+99, 30);
  if (add_delete == 'select'){
    fill(204, 204, 0);
    text('Update', (windowWidth/3)+106, 30);
  } else {
    fill(0, 0, 0);
    text('Update', (windowWidth/3)+106, 30);
  }
  if (add_delete == 'set_origin'){
    fill(255, 0, 255);
    text('Set origin', (windowWidth/3)+15, 60);
  } else {
    fill(0, 0, 0);
    text('Set origin', (windowWidth/3)+15, 60);
  }
  fill(0, 0, 0);
  text('|', (windowWidth/3)+82, 60);
  if (add_delete == 'delete_origin'){
    fill(153, 0, 153);
    text('Delete origin', (windowWidth/3)+89, 60);
  } else {
    fill(0, 0, 0);
    text('Delete origin', (windowWidth/3)+89, 60);
  }
  fill(0, 0, 0);
  text('(\u2316)', (windowWidth/3)+180, 60);
  if (add_delete == 'set_scale'){
    fill(51, 153, 255);
    text('Set scale point', (windowWidth/3)+15, 90);
  } else {
    fill(0, 0, 0);
    text('Set scale point', (windowWidth/3)+15, 90);
  }
  fill(0, 0, 0);
  text('|', (windowWidth/3)+118, 90);
  if (add_delete == 'delete_scale'){
    fill(0, 102, 204);
    text('Delete scale point', (windowWidth/3)+125, 90);
  } else {
    fill(0, 0, 0);
    text('Delete scale point', (windowWidth/3)+125, 90);
  }
  fill(0, 0, 0);
  text('(\u25B2)', (windowWidth/3)+255, 90);
  fill(0, 0, 0);
  text('Scale point distance (meters) :', (windowWidth/3)+15, 120);
  fill(0, 0, 0);
  text('Points size ', (windowWidth/3)+15, 150);
  // Adds label list display
  set_label_display_sizes();
  textSize(text_size);
  fill(0,0,0);
  text('Your labels', windowWidth-125, (165+(text_size*1.6)));
  for (let i = 0; i < labels_number; i++){
    line(windowWidth-140,165+(text_size*2)*(i+1.25),windowWidth,165+(text_size*2)*(i+1.25));
    textSize(text_size);
    fill(colors[i]);
    text(labels_names[i], windowWidth-125, 165+(text_size*2)*(i+2));
  }
  line(windowWidth-140,165+(text_size*2)*(labels_number+1.25),windowWidth,165+(text_size*2)*(labels_number+1.25));

  // Calculates and draws the wheel
  angle = 360/parts;
  angleMode(DEGREES);
  fill(200,200,200);
  ellipse(windowWidth-70,windowHeight-60,100);
  for (let i = 0; i < parts; i++){
    line(windowWidth-70,windowHeight-60,windowWidth-70+50*cos(-90-angle/2+angle*i),windowHeight-60+50*sin(-90-angle/2+angle*i));
  }
  for (let i = 0; i < angle; i++){
    line(windowWidth-70,windowHeight-60,windowWidth-70+50*cos(-90-angle/2+i+angle*wheel_part),windowHeight-60+50*sin(-90-angle/2+i+angle*wheel_part))
  }

  // Notifies (only once) the user that the window seems to be too small.
  if (size_window == true){
    if (browserName == 'safari'){
      if (windowWidth < 860 || windowHeight < (295+labels_number*20)){
        alert('Your window seems to be too small for the app. \nDisplay can be affected or using the app can be difficult. \n\nIf possible, try to enlarge the window.');
        size_window = false
      }
    } else if (browserName == 'chrome' || browserName == 'edge' || browserName == 'opera' || browserName == 'opera' || browserName == 'firefox' || browserName == 'No browser detected'){
      if (windowWidth < 885 || windowHeight < (295+labels_number*20)){
        alert('Your window seems to be too small for the app. \nDisplay can be affected or using the app can be difficult. \n\nIf possible, try to enlarge the window.');
        size_window = false
      }
    }
  }
}
