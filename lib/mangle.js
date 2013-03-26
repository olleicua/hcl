module.exports = function(identifier) {
  return identifier
    .replace(/_/g, '__')
    .replace(/!/g, '_exclamation_')
    .replace(/\?/g, '_question_')
    .replace(/%/g, '_percent_')
    .replace(/&/g, '_ampersand_')
    .replace(/@/g, '_at_')
    .replace(/#/g, '_pound_')
    .replace(/\|/g, '_bar_')
    .replace(/\*/g, '_asterisk_')
    .replace(/\+/g, '_plus_')
    .replace(/\-/g, '_hyphen_')
    .replace(/=/g, '_equals_')
    .replace(/\//g, '_slash_')
    .replace(/</g, '_less_than_')
    .replace(/>/g, '_greater_than_')
    .replace(/\^/g, '_caret_')
    .replace(/^(break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|void|while|with|class|enum|export|extends|import|super|implements|interface|let|package|private|protected|public|static|yield)$/, '_$1_');
}