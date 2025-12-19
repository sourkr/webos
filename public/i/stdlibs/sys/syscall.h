#ifndef _SYS_SYSCALL_H
#define _SYS_SYSCALL_H

#define SYS_exit 0x00
#define SYS_fork 0x01

#define SYS_window_create 0x0a
#define SYS_window_set_title 0x0b
#define SYS_window_set_child 0x0c
#define SYS_window_show 0x0d

#define SYS_term_view_new 0x10
#define SYS_term_view_insert 0x11

#define SYS_sleep 0x20

void syscall(char a) {
    asm("syscall" : : "r0"(a));
}

void syscall1(char a, char b) {
    asm("syscall" : : "r0"(a), "r1"(b));
}

void syscall2(char a, char b, char c) {
    asm("syscall" : : "r0"(a), "r1"(b), "r2"(c));
}

#endif
