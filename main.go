package main

import "fmt"

func main() {
	c := make(chan struct{})
	<-c
}

//go:wasmexport malloc
func malloc(len uint32) *byte {
	buf := make([]byte, len)
	return &buf[0]
}

//go:wasmexport printString
func printString(str string) {
	fmt.Println(str)
}
