// URISOLVE Example program
#include <iostream>
#include "opencv2/opencv.hpp"

using namespace cv;

int main(int argc, char** argv) {

  std::cout << "OpenCV::Test started...\n";
  Mat img = imread(argv[1], -1);
  /*
  if (!img.empty()) {

	namedWindow("programa", cv::WINDOW_AUTOSIZE);
	imshow("programa", img);
	waitKey(0);
	destroyWindow("programa");
  }
  */
  std::cout << "OpenCV::Waiting!\n";
  
  while(1);
}