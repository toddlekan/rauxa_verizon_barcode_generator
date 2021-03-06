var $ = jQuery.noConflict();

$(document).ready(function(){

	var frm_generator = $('#frm-generator'),
		frm_login = $('#frm-login');

	if(frm_login.length > 0){

		submit_form_push(frm_login, function(obj){
			console.log(frm_login);
			if(!obj.errcode){

				window.location.href = "/home";
			}

		});
	}

	var val_alpha_num = function(obj){
		var regex = /^[A-Za-z0-9 ]{0,20}$/;
		return (!regex.test(obj) ? false : true);
	};


	if(frm_generator.length > 0){

		var frm_alert = frm_generator.find('#gen-msg'),
			input_group = $('#i_group_id')
			input_barcode = $('#i_barcode_id'),
			input_split = $('#i_split_num')
			input_total = $('#i_total'),
			form_wrap = $('#form-wrap'),
			loader = $('.loader');

		check_group_length();
		check_codes();

		frm_generator.find('button[type="submit"]').on('mouseup', function(){

			loader.fadeIn(100, function(){
				form_wrap.fadeOut(400);
			})
		});

		submit_form_push(frm_generator, function(obj){

			var file_wrap = $('#file-wrap'),
				loader = $('.loader');

			var holder = $('#file-holder');

			//console.log(obj);
			$i = 1;

			if(!obj.errcode){

				var checkfiles = function(){

					clearTimeout(checkTimer);
					var checkTimer = setTimeout(function(){

						$.get('/filecheck/'+obj.filename, function(arr){

							if($i > 30){
								clearTimeout(checkTimer);
							}

							if(arr.errcode){

								$i++
								checkfiles();

							}else{

								file_wrap.fadeIn(400, function(){

									loader.fadeOut(100);

								});

								var files = arr.files;

								$.each(files, function(key, val){
									//console.log(val)
									holder.append('<a class="file-icon" href="/storage/'+val.filename+'" target="_blank"><span class="fa fa-file"></span><span class="file-name">'+val.filename+'</span></a>');

								});

								clearTimeout(checkTimer);
							}

						}, 'json');

					}, 2000);
				}

				checkfiles();


			}

		});

		input_split.on('keyup', function(){

			var $this = $(this),
				form_group = $this.closest('div.form-group'),
				this_val = parseInt($this.val()),
				len = this_val.length,
				total_val =  parseInt(input_total.val());

			if(this_val*2 > total_val){

				alert_split(true);
				//toggle_generator_form(false);

			}else{

				alert_split(false);
				//toggle_generator_form(true);

			}
		});

		input_total.on('keyup', function(){

			check_codes();
		});

		input_total.on('blur', function(){

			$(this).frmtNumberTypes({
				comma:true,
				type: 'number'
			});

		});

		input_total.on('focus', function(){

			$(this).frmtNumberTypes({
				comma:false,
				type: 'number'
			});

		});

		input_group.on('keyup', function(){

			check_group_length();

		});

		input_barcode.on('keyup', function(){

			var barcode_val 	= input_barcode.val(),
				barid_parent 	= input_barcode.closest('div.form-group');

			if(!val_alpha_num(barcode_val)){
				//input_barcode.val('');
				if(!barid_parent.hasClass('has-warning'))
					 barid_parent.addClass('has-warning');
				toggle_generator_form(true);
				frm_alert.text('<Barcode ID> can only contain 20 or less AlphaNumeric Characters.')
					.fadeIn(400);
			}else{
				if(barid_parent.hasClass('has-warning'))
					 barid_parent.removeClass('has-warning');
				toggle_generator_form(false);
				frm_alert.text('')
					.fadeOut(200);
				check_codes();
			}

		});



		function check_group_length(){

			var group_val = input_group.val(),
				groupid_parent 	= input_group.closest('div.form-group');

			if(!val_alpha_num(group_val)){

				frm_alert.text('<Group ID> can only contain 20 or less AlphaNumeric Characters.').fadeIn(400);

				if(!groupid_parent.hasClass('has-warning'))
					 groupid_parent.addClass('has-warning');

				toggle_generator_form(true);

			}else{

				if(frm_alert.is(':visible'))
					frm_alert.text('')
						.fadeOut(100);

				if(groupid_parent.hasClass('has-warning'))
					 groupid_parent.removeClass('has-warning');

				toggle_generator_form(false);
			}

		}

		function check_codes(){

			var barcode_val 	= input_barcode.val(),
				group_val 		= input_group.val(),
				total_val 		= input_total.val(),
				barid_parent 	= input_barcode.closest('div.form-group'),
				total_parent 	= input_total.closest('div.form-group');;




				if(group_val != '' && barcode_val != '' && total_val != ''){

					$.get('/check_codes/'+group_val+'/'+barcode_val+'/'+total_val, function(arr){

						if(arr.errcode){

							if(arr.msg)
								frm_alert.text(arr.msg)
									.fadeIn(400);

							if(!total_parent.hasClass('has-warning'))
								 total_parent.addClass('has-warning');

							if(!barid_parent.hasClass('has-warning'))
								 barid_parent.addClass('has-warning');



							toggle_generator_form(true);

						}else{

							if(frm_alert.is(':visible'))
								frm_alert.text('')
									.fadeOut(200);

							if(total_parent.hasClass('has-warning'))
								 total_parent.removeClass('has-warning');

							if(barid_parent.hasClass('has-warning'))
								 barid_parent.removeClass('has-warning');

							toggle_generator_form(false);

						}
					});
				}

		}

/*
	var alert_codes = function(status, alert){

		var barid_input 	= $('#i_barcode_id'),
			barid_parent 	= barid_input.closest('div.form-group'),
			total_input 	= $('#i_total'),
			total_parent 	= total_input.closest('div.form-group');

		if(status){

			frm_alert.text(alert)
				.fadeIn(400);

			if(!total_parent.hasClass('has-warning'))
				 total_parent.addClass('has-warning');

			if(!barid_parent.hasClass('has-warning'))
				 barid_parent.addClass('has-warning');

		}else{

			if(frm_alert.is(':visible'))
				frm_alert.text('')
					.fadeOut(200);

			if(total_parent.hasClass('has-warning'))
				 total_parent.removeClass('has-warning');

			if(barid_parent.hasClass('has-warning'))
				 barid_parent.removeClass('has-warning');

		}

	}
*/



		var alert_split = function(status){

			var split_input = $('#i_split_num'),
				split_parent 	= split_input.closest('div.form-group');

			var alert_adjust = 'The split amount must be less than or equal to half of the total number of codes.';

			if(status){

				frm_alert.text(alert_adjust)
					.fadeIn(400);

				if(!split_parent.hasClass('has-warning'))
					 split_parent.addClass('has-warning');

			}else{

				if(frm_alert.is(':visible'))
					frm_alert.text('')
						.fadeOut(400);

				if(split_parent.hasClass('has-warning'))
					 split_parent.removeClass('has-warning');

			}

		}

		function toggle_generator_form(status){

			var btn = frm_generator.find('button[type="submit"]');
			if(status){
				btn.prop('disabled',true);
			}else{
				btn.prop('disabled',false);
			}
		}
	}


	var popovers = $('[data-toggle="popover"]');

	popovers.each(function(){

		$(this).popover({
			container: 'body',
			html: true,
			placement: 'left',
		});

		$(this).on('shown.bs.popover', function(){

			var open_popover = $('.popover.in');

			$('*').one('click', function(){
				open_popover.popover('hide');
			});
		});
	});

	var modal_lnks = get_modal_lnks();

	modal_lnks.open_modal(function(modal){

		var add_row_lnk = get_add_row_lnks(),
			del_row_lnk = get_del_row_lnks();

		del_row_lnk.handle_delrow();

		add_row_lnk.on('click', function(){

			var type = modal.data('type'),
				val = modal.find('*[rel="add-row-val"]').val(),
				list_holder = modal.find('#'+type+'-list-holder'),
				list_cnt = list_holder.find('tr').length;

			if(val.length > 0){

				var $this = $(this),
					obj = $this.data('target');

				var template = handleTemplate(obj),
					html = $(template);

				html.find('input')
					.attr('value',val);


				del = get_del_row_lnks(html);
				del.handle_delrow();

				html.appendTo(list_holder);

				set_row_ids(list_holder);
			}

		});

	});



});


function submit_form_push(frm, callback){

		var $frm = $(frm),
			msg = $frm.find('.alert');


			$frm.on('submit', function(event){
				if($frm[0].checkValidity()){
				event.preventDefault();

				function showResponse(responseText) {

					var arr = responseText;

					if(!arr.errcode){

						if(arr.msg){
							if(msg.hasClass('alert-danger')){

								msg.text(arr.msg)
									.removeClass('alert-danger')
									.addClass('alert-success')
									.fadeIn(400, function(){
										if(typeof callback === 'function'){
											var wait = setTimeout(function(){
												callback(arr);
												clearTimeout(wait);
											}, 1000);
										}

									});

							}else{

								msg.text(arr.msg)
									.addClass('alert-success')
									.fadeIn(400, function(){
										if(typeof callback === 'function'){
											var wait = setTimeout(function(){
												callback(arr);
												clearTimeout(wait);
											}, 1000);
										}

									});

							}
						}else{
							if(typeof callback === 'function'){
											var wait = setTimeout(function(){
												callback(arr);
												clearTimeout(wait);
											}, 1000);
										}
						}

					}else{

						if(arr.msg){
							if(msg.hasClass('alert-success')){

								msg.text(arr.msg)
									.removeClass('alert-success')
									.addClass('alert-danger')
									.fadeIn(400, function(){
										if(typeof callback === 'function'){
											var wait = setTimeout(function(){
												callback(arr);
												clearTimeout(wait);
											}, 1000);
										}

									});

							}else{

								msg.text(arr.msg)
									.addClass('alert-danger')
									.fadeIn(400, function(){
										if(typeof callback === 'function'){
											var wait = setTimeout(function(){
												callback(arr);
												clearTimeout(wait);
											}, 1000);
										}

									});

							}
						}else{
							if(typeof callback === 'function'){
											var wait = setTimeout(function(){
												callback(arr);
												clearTimeout(wait);
											}, 1000);
										}
						}

					}

				}

				if($('#i_total').length > 0){
					$('#i_total').frmtNumberTypes({
						comma:false,
						type: 'number'
					});
				}

				var options = {
					type: 'POST',
					success : showResponse
				};

				$frm.ajaxSubmit(options);
				}
			});


	}

var handleTemplate = function(name){

	var template = $(name);
	return template.html();

};

var get_modal_lnks = function(){
	return $('*[rel="open-modal"]');
}

var get_add_row_lnks = function(obj){
	return (typeof obj != 'undefined' ? obj.find('*[rel="add-row"]') : $('*[rel="add-row"]') );
}

var get_del_row_lnks = function(obj){
	return (typeof obj != 'undefined' ? obj.find('*[rel="delete-row"]') : $('*[rel="delete-row"]') );
}

var set_row_ids = function(obj){

	var rows = obj.find('tr'),
		type = obj.closest('div.modal').data('type'),
		list_cnt = rows.length;

	if(rows.length > 0){
		return rows.each(function(i){

			var $this = $(this);

			$this.find('input')
				.attr('id','row-'+ (i) )
				.attr('name',type+':'+(i));
		});
	}

}

$.fn.handle_delrow = function(){

	var $this = $(this);

	return $this.on('click', function(){

		var $this = $(this),
			parent = $this.closest('tr'),
			table = $this.closest('table');
		console.log(table)
		parent.fadeOut(600, function(){

			parent.remove();

			var wait = setTimeout(function(){

				set_row_ids(table);
				clearTimeout(wait);
			}, 200);
		});
	});
}

$.fn.open_modal = function(callback){

	var lnk = $(this);

	return 	lnk.on('click', function(event){

		event.preventDefault();

		var $this = $(this),
			obj = $this.data('target');

		var template = handleTemplate(obj),
			html = $(template);

		html.on('shown.bs.modal', function(){

			submit_form_push(html.find('form'), function(){

				html.modal('hide');
				location.reload();
			});

			if(typeof callback == 'function'){

				callback(html);

			}
		});

		html.on('hidden.bs.modal', function(){

			html.remove();
		});


		html.modal('show');

	});
};


// $.fn.setCurrency = function() {
//
// 	var elem = $(this);
//
// 	return elem.each(function(){
//
// 		var field = $(this);
//
// 		field.frmtNumberTypes({
// 			comma:true,
// 			symbol:'$',
// 			type: 'currency'
// 		});
//
// 		if(field.is('input')){
//
// 			if(field.data('focus-setCurrency') != 1){
// 				field.data('focus-setCurrency', 1);
// 				field.bind('focus', function() {
// 					var fVal = $(this).val();
// 					field.val(stripCurrency(fVal));
// 					field.select();
// 				});
// 			}
//
// 			if(field.data('blur-setCurrency') != 1){
// 				field.data('blur-setCurrency', 1);
// 				field.bind('blur', function() {
// 					//var fVal = $(this).val();
// 					$(this).frmtNumberTypes({
// 						comma:true,
// 						symbol:'$',
// 						type: 'currency'
// 					});
// 					///field.val(fVal.frmtCurrency());
// 				});
// 			}
//
// 		}
// 	});
// };
//
$.fn.frmtNumberTypes = function(number, format) {

	var $this = this;

	if (typeof(number) === 'object') {
		//incase just parameters are entered and not a number
		var format = number;
		number = ($this.is('input') ? $this.val() : $this.html());
	}

	if(typeof format.comma == 'undefined'){
		format.comma = (typeof format.commas != 'undefined' ? format.commas : false);
	}

	var isnegative = false;

	//if(number != ''){
		var format = format || {},
			comma = format.comma,
			symbol = format.symbol || "$",
			type	 = format.type   || 'number';

		//console.log(format)
		switch(type){

			case 'currency' :
				number = stripCurrency(number);
				break;

			case 'percent' :
				number = (val_percent(number) ? stripPercent(number) : 0);
				break;

			case 'number' :
			default:
				number = stripInteger(number);
		}

		number = (number != '' ? parseInt(number) : parseInt(0));

		if (comma) {


			var count = 0;
			if(number < 0){
				isnegative = true;
				number = number.toString().replace('-','');
			}

			var numArr = number.toString().split("");

			var len = numArr.length - 3;

			for (var i = len; i > 0; i= i - 3) {
				numArr.splice(i,0,",");

			}

			number = numArr.join("");

			if(isnegative){
				number = '-'+number;
			}

		}

		if (typeof symbol === 'string') {

			switch(type){

				case 'currency' :
					number = symbol + number;
					break;

				case 'percent' :
					number = number + symbol;
					break;

				case 'number' :
				default:
					if(number == 0){
						number = "";
					}
			}
		}

		if($this.is('input')){
			$this.val(number);
		}else{
			$this.html(number);
		}

		return number;

  };

  var stripInteger = function(num){
  	if(typeof num != 'undefined'){
  		num = num.toString();
  		return num.replace(/[^0-9.-]/g, "")
  	}else{
  		return false;
  	}
  };
