module.exports = function(word) {
	return word
		.replace(/!/g, '__exclamation__')
		.replace(/\?/g, '__question__')
		.replace(/%/g, '__percent__')
		.replace(/&/g, '__ampersand__')
		.replace(/@/g, '__at__')
		.replace(/#/g, '__pound__')
		.replace(/\|/g, '__bar__')
		.replace(/\*/g, '__asterisk__')
		.replace(/\+/g, '__plus__')
		.replace(/\-/g, '__hyphen__')
		.replace(/=/g, '__equals__')
		.replace(/\//g, '__slash__')
		.replace(/</g, '__less_than__')
		.replace(/>/g, '__greater_than__')
		.replace(/\^/g, '__caret__')
		.replace(/^(break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with|class|enum|export|extends|import|super|implements|interface|let|package|private|protected|public|static|yield)$/, '__$1__');
}