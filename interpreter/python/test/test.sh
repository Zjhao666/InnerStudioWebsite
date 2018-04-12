yacc -d cal.y

lex cal.l

g++ -o cal y.tab.c 
