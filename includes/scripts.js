$(document).ready(function(){
	const A			= 65; // ASCII value for A
	const Z			= 90; // ASCII value for Z
	const CHARSET	= 26; // Length of Alphabet
	
	/**
	 *	Cleanse Text
	 *
	 *	@param txt			Text to cleanse
	 *	@return				Cleansed text
	 */
	function cleanseText(txt){
		txt = txt.toUpperCase();
		return txt.replace(/[^a-z]+/gi, '');
	}
	
	/**
	 *	Format Text
	 *
	 *	@param txt			Text to format
	 *	@return				Formatted text
	 */
	function formatText(txt){
		var tmp	= '';
		
		//-- Separate string into groups of 5 letters --
		for(var i = 0; i < txt.length; i++){
			tmp += txt[i];
			
			if(i % 5 == 4)
				tmp += ' ';
		}
		
		return tmp;
	}
	
	/**
	 *	Detect Errors
	 *
	 *	@param msg			Input
	 *	@param key			Secret key
	 *	@param button		Which button was pressed
	 *	@return				true: errors
	 *						false: no errors
	 */
	function detectErrors(msg, key, button){
		//-- If no message, warn user --
		if(msg.length < 1){
			alert('Input Required');
			return true;
		}
		
		//-- If no key available --
		if((key.length < 1) && (button == 'decrypt')){
			alert('Key Required');
			return true;
		}
		
		//-- If key is too short, warn user --
		if((msg.length > key.length)){
			alert('Invalid Key');
			return true;
		}
		
		return false;
	}
	
	/**
	 *	Generate Secret Key
	 *
	 *	@param txt			Text to determine key length
	 *	@return				Secret key
	 */
	function generateKey(txt){
		var key = '';
		
		//-- Generate secret key with same length as message --
		for(var i = 0; i < txt.length; i++)
			key	+= String.fromCharCode(Math.floor(Math.random() * CHARSET) + A);
		
		return key;
	}
		
	//-- Only Allow Letters To Be Typed --
	$('textarea').alpha();
	
	//-- Encrypt, Decrypt Input --
	$('#encrypt, #decrypt').click(function(){
		//-- Get Inputs --
		var btn = $(this).attr('id');
		var msg	= cleanseText($('#input').val());
		var key	= cleanseText($('#key').val());
		var out	= '';
		
		//-- Encrypt Input --
		if(btn == 'encrypt'){
			//-- If no key, generate key --
			if(key.length < 1)
				key = generateKey(msg);
				
			//-- Check for errors --
			if(!detectErrors(msg, key, btn)){
				//-- Encrypt msg with key --
				for(var i = 0; i < msg.length; i++){
					var msgTmp	= msg[i].charCodeAt();
					var keyTmp	= key[i].charCodeAt();
					var tmp		= msgTmp + keyTmp - (A - 1);
					
					//-- Roll over if value passes Z --
					if(tmp > Z)
						tmp	-= CHARSET;
					
					out += String.fromCharCode(tmp);
				}
				
				//-- Display output(s) --
				$('#input').val(formatText(msg));
				$('#key').val(formatText(key));
				$('#output').val(formatText(out));
			}
		}
		
		//-- Decrypt Input --
		else if(btn == 'decrypt'){
			//-- Check for errors --
			if(!detectErrors(msg, key, btn)){
				//-- Decrypt msg with key --
				for(var i = 0; i < msg.length; i++)
				{
					var msgTmp	= msg[i].charCodeAt();
					var keyTmp	= key[i].charCodeAt();
					var tmp		= msgTmp - keyTmp + (A - 1);
					
					//-- Roll over if value passes A --
					if(tmp < A)
						tmp	+= CHARSET;
					
					out += String.fromCharCode(tmp);
				}
				
				//-- Display output(s) --
				$('#input').val(formatText(msg));
				$('#key').val(formatText(key));
				$('#output').val(formatText(out));
			}
		}
	});
	
	//-- Reset Fields --
	$('#reset').click(function(){
		$('textarea').val('');
	});
});