#include "gui.h"
#include <unistd.h>

int main() {
    char win = window_create();
    window_show(win);
    
    char term = term_view_new();
    window_set_child(win, term);

    fork();
    term_view_insert(term, 1);

    sleep(1);
}
