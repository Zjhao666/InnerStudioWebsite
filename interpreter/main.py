# Token types
#
# EOF (end-of-file) token is used to indicate that
# there is no more input left for lexical analysis
EOF = 'EOF'
INTEGER = 'INTEGER'
LBRACKET, RBRACKET = 'LBRACKET', 'RBRACKET'
ADD, SUB, MUL, DIV = 'ADD', 'SUB', 'MUL', 'DIV'


class Token(object):
    def __init__(self, type, value):
        self.type = type
        self.value = value

    def __str__(self):
        return 'Token({type}, {value})'.format(type=self.type,value=repr(self.value))

    def __repr__(self):
        return self.__str__()

class Lexer(object):
    def __init__(self, text):
        self.text = text
        self.pos = 0
        self.limit = len(text)

    def error(self):
        raise Exception('Invalid syntax')

    def get_next_token(self):
        if self.pos == self.limit:
            return Token(EOF, None)
        token = None
        current_char = self.text[self.pos]
        if current_char.isdigit():
            buf = current_char
            while self.pos < self.limit-1:
                self.pos += 1
                current_char = self.text[self.pos]
                if not current_char.isdigit():
                    self.pos -= 1
                    break
                buf += current_char
            token = Token(INTEGER, int(buf))
        elif current_char == '+':
            token = Token(ADD, current_char)
        elif current_char == '-':
            token = Token(SUB, current_char)
        elif current_char == '*':
            token = Token(MUL, current_char)
        elif current_char == '/':
            token = Token(DIV, current_char)
        elif current_char == '(':
            token = Token(LBRACKET, current_char)
        elif current_char == ')':
            token = Token(RBRACKET, current_char)
        elif current_char == ' ':
            self.pos += 1
            return self.get_next_token()

        if token:
            self.pos += 1
            return token
        else:
            self.error()

class Interpreter(object):
    def __init__(self, lexer):
        self.lexer = lexer
        self.cur_token = self.lexer.get_next_token()

    def error(self):
        raise Exception('Invalid syntax')

    def factor(self):
        if self.cur_token.type == INTEGER:
            ret = self.cur_token.value
            self.cur_token = self.lexer.get_next_token()
            return ret
        else :
            self.error()

    def term(self):
        ret = self.factor()
        while self.cur_token.type in (MUL, DIV):
            token = self.cur_token
            if token.type == MUL:
                self.cur_token = self.lexer.get_next_token()
                ret *= self.factor()
            elif token.type == DIV:
                self.cur_token = self.lexer.get_next_token()
                ret /= self.factor()
        return ret

    def expr(self):
        ret = self.term()
        while self.cur_token.type in (ADD, SUB):
            token = self.cur_token
            if token.type == ADD:
                self.cur_token = self.lexer.get_next_token()
                ret += self.term()
            elif token.type == SUB:
                self.cur_token = self.lexer.get_next_token()
                ret -= self.term()
        return ret

def main():
    while True:
        try:
            # To run under Python3 replace 'raw_input' call
            # with 'input'
            text = raw_input('calc> ')
        except EOFError:
            break
        if not text:
            continue
        lexer = Lexer(text)
        interpreter = Interpreter(lexer)
        print(interpreter.expr())


if __name__ == '__main__':
    main()
