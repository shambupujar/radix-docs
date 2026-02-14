---
title: "Usage Guide"
---

# Usage Guide

This section is a usage guide of the various Radix Engine Toolkit wrappers alongside example usages.

## Notes

- All of the Swift examples provided in this section depend on a utility file that contains the following code:

  ``` swift
  import Foundation

  extension String {
      func hexToData() -> Data? {
          var data = Data()
          var startIndex = self.startIndex
          while startIndex < self.endIndex {
              let endIndex = self.index(startIndex, offsetBy: 2)
              if let byte = UInt8(self[startIndex..<endIndex], radix: 16) {
                  data.append(byte)
              } else {
                  return nil // Invalid hex string
              }
              startIndex = endIndex
          }
          return data
      }
  }
  ```
