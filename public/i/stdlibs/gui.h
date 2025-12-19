#include <sys/syscall.h>

char winc = 0;
char viewc = 0;

char window_create() {
    syscall1(SYS_window_create, winc);
    return winc++;
}

void window_show(char win) {
    syscall1(SYS_window_show, win);
}

void window_set_child(char win, char view) {
    syscall2(SYS_window_set_child, win, view);
}

char term_view_new() {
    syscall1(SYS_term_view_new, viewc);
    return viewc++;
}

void term_view_insert(char term, char ch) {
    syscall2(SYS_term_view_insert, term, ch);
}
