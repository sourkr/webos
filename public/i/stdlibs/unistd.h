#include <sys/syscall.h>

void sleep(char sec) {
    syscall1(SYS_sleep, sec);
}

void fork() {
    syscall(SYS_fork);
}
