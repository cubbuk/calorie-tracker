import CTAlert from "./ct_alert/ct_alert";
import CTFormInput from "./ct_form_input/ct_form_input";
import CTError from "./ct_error/ct_error";
import CTPaginator from "./ct_paginator/ct_paginator";
import CTTimeSlider from "./ct_time_slider/ct_time_slider";
import CTConfirmModal from "./ct_confirm_modal/ct_confirm_modal";

let exportObject = {CTAlert, CTConfirmModal, CTError, CTFormInput, CTPaginator, CTTimeSlider};

module.exports = exportObject;

export default exportObject;