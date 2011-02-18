$(document).ready(function(){
	const A			= 65;
	const Z			= 90;
	const CHARSET	= 26;
	
	/**
	 *	Only Allow Letters To Be Typed
	 */
	$('textarea').alpha();
	
	/**
	 *	Focus on Text Box
	 */
	$('textarea').focus(function(){
		$(this).addClass('active');
	});
	
	/**
	 *	Blur on Text Box
	 */
	$('textarea').blur(function(){
		$(this).removeClass('active');
	});
	
	/**
	 *	Typing in Text Box
	 */
	$('textarea').keyup(function(){
		$(this).val(formatText($(this).val()));
	});
	
	/**
	 *	Input Help
	 */
	$('#input_help').click(function(){
		alert(
			"If you are encrypting a message, place your plaintext message here.\r\n\r\n" +
			"If you are decrypting a message, place your encrypted message here.\r\n\r\n" +
			"This field is always required."
		);
	});
	
	/**
	 *	Secret Key Help
	 */
	$('#key_help').click(function(){
		alert(
			"Always place your secret key here.\r\n\r\n" +
			"This field is required if you are decrypting a message.\r\n\r\n" +
			"If you leave this field blank while encrypting a message, a key will be generated for you.\r\n\r\n" +
			"If this field is shorter than the Input Message, your action will not execute."
		);
	});
	
	/**
	 *	Output Help
	 */
	$('#output_help').click(function(){
		alert(
			"The output of your action will always be placed here.\r\n\r\n" +
			"This field is never required and always over written upon successful execution of an action."
		);
	});
	
	/**
	 *	Cleanse Text
	 *
	 *	@param txt			Text to cleanse
	 *	@return				Cleansed text
	 */
	function cleanseText(txt)
	{
		//-- Return only alpha characters --
		return txt.replace(/[^a-z]+/gi,'');
	}
	
	/**
	 *	Format Text
	 *
	 *	@param txt			Text to format
	 *	@return				Formatted text
	 */
	function formatText(txt)
	{
		var tmp	= '';
		txt		= txt.toUpperCase();
		txt		= cleanseText(txt);
		
		//-- Separate string into groups of 5 letters --
		for(var i = 0; i < txt.length; i++)
		{
			tmp += txt[i];
			
			if(i % 5 == 4)
				tmp += ' ';
		}
		
		return tmp;
	}
	
	/**
	 *	Generate Secret Key
	 *
	 *	@param txt			Text to determine key length
	 *	@return				Secret key
	 */
	function generateKey(txt)
	{
		var key = '';
		
		//-- Generate secret key with same length as message --
		for(var i = 0; i < txt.length; i++)
			key	+= String.fromCharCode(Math.floor(Math.random() * 26) + 65);
		
		return key;
	}
	
	/**
	 *	Encrypt Input
	 */
	$('#encrypt').click(function(){
		//-- Get Inputs --
		var msg	= cleanseText($('#input').val());
		var key	= cleanseText($('#key').val());
		var out	= '';
		
		//-- If no message, warn user --
		if(msg.length < 1)
			alert('You need to enter a message before you can encrypt it!');
		else
		{
			//-- If no key available, generate one --
			if(key.length < 1)
				key	= generateKey(msg);
			
			//-- If key is too short, warn user --
			if(msg.length > key.length)
				alert('Your secret key is not long enough to encrypt your message. Please use a different key or delete your key to generate a new key.');
			else
			{
				//-- Encrypt msg with key --
				for(var i = 0; i < msg.length; i++)
				{
					var msgTmp	= msg[i].charCodeAt();
					var keyTmp	= key[i].charCodeAt();
					var tmp		= msgTmp + keyTmp - 64;
					
					//-- Roll over if value passes 'Z' --
					if(tmp > 90)
						tmp	-= 26;
					
					out			+= String.fromCharCode(tmp);
				}
				
				//-- Display output(s) --
				$('#key').val(formatText(key));
				$('#output').val(formatText(out));
			}
		}
	});
	
	/**
	 *	Decrypt Input
	 */
	$('#decrypt').click(function(){
		//-- Get Inputs --
		var msg	= cleanseText($('#input').val());
		var key	= cleanseText($('#key').val());
		var out	= '';
		
		//-- If no message, warn user --
		if(msg.length < 1)
			alert('You need to enter a message before you can decrypt it!');
		else
		{
			//-- If no key available, generate one --
			if(key.length < 1)
				alert('A secret key is required to decrypt a message.');
			
			//-- If key is too short, warn user --
			else if(msg.length > key.length)
				alert('Your secret key is not long enough to decrypt your message. Please use a different key.');
			else
			{
				//-- Decrypt msg with key --
				for(var i = 0; i < msg.length; i++)
				{
					var msgTmp	= msg[i].charCodeAt();
					var keyTmp	= key[i].charCodeAt();
					var tmp		= msgTmp - keyTmp + 64;
					
					//-- Roll over if value passes 'A' --
					if(tmp < 65)
						tmp	+= 26;
					
					out			+= String.fromCharCode(tmp);
				}
				
				//-- Display output(s) --
				$('#key').val(formatText(key));
				$('#output').val(formatText(out));
			}
		}
	});
	
	/**
	 *	Reset Fields
	 */
	$('#reset').click(function(){
		$('textarea').val('');
	});
});